const {IP, Network} = require('./index');

const nw = new Network("192.168.10.10","255.255.255.0");
const nwCidr = Network.fromCidr("192.168.1.10/24"); // Returns Network. Network instance by initializing from CIDR format.
console.log(nw.includes(new IP("192.168.10.50"))); // Returns Bool. Does the network contain this ip?
console.log(nw.nextNetwork()); // Returns Network. Gives next network. For ex; 192.168.10.1 -> 192.168.11.1
console.log(nw.preNetwork()); // Returns Network. Gives previous network. For ex; 192.168.10.1 -> 192.168.9.1
console.log(nw.ipList) // A list containing all of IPs in this network.
console.log(nw.cidr) // CIDR format of this network
console.log(nw.json) // JSON formatted network object
console.log(Network.validateCidr("192.168.10.1/29")) // Returns Boolean. Validates the cidr format is right.

const ip = new IP("192.168.1.2");
console.log(ip.in(nw));  // Returns Boolean. Is the IP in this network?
console.log(ip.toBinary()); // Returns String. Converts IP into binary format. For ex; 192.168.1.2 -> 11000000101010000000000100000010
console.log(IP.bin2Ip("11000000101010000000000100000010")) // Returns IP. Converts binary into IP format. For ex; 11000000101010000000000100000010 -> 192.168.1.2
console.log(ip.and(new IP("255.255.255.0"))) // Returns IP. Makes logical and operation with another ip. Usefull for calculation network address.
console.log(ip.nextIp()); // Returns IP. Gives next network ip. For ex; 192.168.1.2 -> 192.168.1.3
console.log(ip.preIp()); // Returns IP. Gives previous network ip. For ex; 192.168.1.2 -> 192.168.1.1
console.log(ip.distance(new IP("192.168.1.10"))) // Returns Number. Gives how many ip between two address.
console.log(IP.validateIp("192.168.1.67")) // Returns Boolean. Validates the ip format is right.




