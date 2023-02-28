const {RequiredArgumentError, WrongArgumentTypeError,
       WrongIpFormat ,WrongCidrFormat } = require('./errors');

const required = (arg) => {
    throw new RequiredArgumentError(`Argument [${arg}] is required`)
}

class IP{
    ip;

    /**
    * @param {string} ip xxx.xxx.xxx.xxx
    */
    constructor(ip=required("ip")){

        this.ip = ip; 
        if (!IP.validateIp(this.ip)){
            throw new WrongIpFormat("IP not in [xxx.xxx.xxx.xxx] format")
        }
    }

    /**
    * @param {string} ip xxx.xxx.xxx.xxx Returns Boolean. Validates the ip format is right.
    */
    static validateIp = (ip=required("ip")) => {
        return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/.test(ip.toString());
    }

    /**
    *  Returns String. Converts IP into binary format. For ex; 192.168.1.2 -> 11000000101010000000000100000010
    */
    toBinary = () => {
        return this.ip.split(".").map(part=>{
            return parseInt(part).toString(2).padStart(8,"0");
        }).join("");
    }

    /**
    * @param {string} bin Returns IP. Converts binary into IP format. For ex; 11000000101010000000000100000010 -> 192.168.1.2
    */
    static bin2Ip = (bin=required("bin")) => {
        const chunkBin = bin.match(/.{1,8}/g);
        return new IP(chunkBin.map(part=>parseInt(part,2)).join("."));
    }
    
    /**
    * @param {IP} otherIp Returns IP. Makes logical and operation with another ip. Usefull for calculation network address.
    */
    and = (otherIp=required("otherIp")) => {
        if (otherIp instanceof Object && !(otherIp instanceof Array) && otherIp.constructor.name === "IP"){
        }
        else{
            otherIp = new IP(otherIp);
        }
        const ipBin = this.toBinary();
        const otherBin = otherIp.toBinary();
        const chunkIp = ipBin.match(/.{1,8}/g);
        const chunkOtherIp = otherBin.match(/.{1,8}/g);
        let resultBin = [];
        for (let i=0;i < chunkIp.length; i++){
            resultBin.push((parseInt(chunkIp[i],2) & parseInt(chunkOtherIp[i],2)).toString(2).padStart(8,"0"));
        }
        return new IP(resultBin.map(part=>parseInt(part,2)).join("."));
    }

    /**
    * @param {int} value Default 1. Returns IP. Gives next network ip. For ex; 192.168.1.2 -> 192.168.1.3
    */
    nextIp = (value=1) => {
        const bin = this.toBinary();
        return IP.bin2Ip((parseInt(bin,2)+value).toString(2).padStart(32,"0"));
    }

    /**
    * @param {int} value Default 1. Returns IP. Gives previous network ip. For ex; 192.168.1.2 -> 192.168.1.1
    */
    preIp = (value=1) => {
        const bin = this.toBinary();
        return IP.bin2Ip((parseInt(bin,2)-value).toString(2).padStart(32,"0"));
    }

    /**
    * @param {IP} otherIp Returns Number. Gives how many ip between two address.
    */
    distance = (otherIp=required("otherIp")) => {
        if (otherIp instanceof Object && !(otherIp instanceof Array) && otherIp.constructor.name === "IP"){
        }
        else{
            otherIp = new IP(otherIp);
        }
        return Math.abs(parseInt(this.toBinary(),2) - parseInt(otherIp.toBinary(),2));
    }
    
     /**
    * Returns String. xxx.xxx.xxx.xxx
    */
    toString = () => {
        return this.ip;
    }

    /**
    * @param {Network} network Returns Boolean. Is the IP in this network?
    */
    in = (network=required("network")) => {
        return network.includes(this);
    }

}

class Network{
    subnetMask;
    ip;
    cidr;

    networkIp;
    ipCount;
    startIp;
    endIp;
    ipList;
    json;

    /**
    * @param {IP} ip
    * @param {IP} subnetMask
    */
    constructor (ip=required("ip"), subnetMask=required("subnetMask")){
        if (ip instanceof Object && !(ip instanceof Array) && ip.constructor.name === "IP"){
            this.ip = ip;
        }
        else{
            this.ip = new IP(ip);
        }
        if (subnetMask instanceof Object && !(subnetMask instanceof Array) && subnetMask.constructor.name === "IP"){
            this.subnetMask = subnetMask;
        }
        else{
            this.subnetMask = new IP(subnetMask);
        }
        
        if (!this.subnetMask || !this.ip){
            throw new RequiredArgumentError("Arguments [subnetMask] and [ip] are required");
        }
        this.ipCount = this.subnetMask.distance(new IP("255.255.255.255"))
        this.networkIp = this.ip.and(this.subnetMask);
        this.startIp = this.networkIp.nextIp(1);
        this.endIp = this.networkIp.nextIp(this.ipCount);
        this.cidr = `${this.ip}/${this.subnetMask.toBinary().replaceAll("0","").length}`
        this.ipList = Array.from(Array(this.ipCount)).map((item,index)=>{
            return this.startIp.nextIp(index);
        })
        this.json = {
            ip: this.ip.ip,
            subnetMask: this.subnetMask.ip,
            cidr: this.cidr,
            networkIp: this.networkIp.ip,
            startIp: this.startIp.ip,
            endIp: this.endIp.ip,
            ipCount: this.ipCount,
            ipList: this.ipList.map(item=>item.ip)
        }

    }

    /**
    * @param {string} cidr // xxx.xxx.xxx.xxx/32 Returns Boolean. Validates the cidr format is right.
    */
    static validateCidr = (cidr=required("cidr")) => {
        return /^([0-9]{1,3}\.){3}[0-9]{1,3}($|\/([0-2]?[0-9]|30|31|32))$/.test(cidr);
    }

    /**
    * @param {string} cidr xxx.xxx.xxx.xxx/32 Returns Network. Network instance by initializing from CIDR format.
    */
    static fromCidr = (cidr=required("cidr")) => {
        if (!Network.validateCidr(cidr)){
            throw new WrongCidrFormat("cidr not in [xxx.xxx.xxx.xxx/xx] format");
        }
        this.cidr = cidr;
        let [ip,suffix] = cidr.split("/");
        let subnetMask = "";
        for (let i=1; i<=parseInt(suffix); i++){
            subnetMask+="1"
        }
        subnetMask = IP.bin2Ip(subnetMask.padEnd(32,"0"));
        ip = new IP(ip);
        return new Network(ip, subnetMask);
    }

    /**
    * @param {int} value Default 1. Returns IP. Gives next network ip. For ex; 192.168.10.1 -> 192.168.11.1
    */
    nextNetworkIp = (value=1) => {
        return this.networkIp.nextIp((this.ipCount+1)*value);
    }

    /**
    * @param {int} value Default 1. Returns IP. Gives previous network ip. For ex; 192.168.10.1 -> 192.168.9.1
    */
    preNetworkIp = (value=1) => {
        return this.networkIp.preIp((this.ipCount+1)*value);
    }

    /**
    * @param {IP} ip Returns Bool. Does the network contain this ip?
    */
    includes = (ip=required("ip")) => {
        if (ip instanceof Object && !(ip instanceof Array) && ip.constructor.name === "IP"){
        }
        else{
            ip = new IP(ip);
        }
        return (ip.toString() >= this.startIp && ip.toString()<=this.endIp)
    }
}

module.exports = {IP, Network}