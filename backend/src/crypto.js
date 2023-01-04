import MD5 from "crypto-js/md5";
const secretHash = (username, password) => {
    const content = username + password + 'C8763';
    var hash = 0;
    if (content.length === 0) return hash;
    for (let i = 0; i < content.length; i++) {
        let chr = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
   
    return  MD5(hash.toString()).toString().substring(0, 20);
};

export default secretHash;