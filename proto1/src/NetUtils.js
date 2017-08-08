
export const GET_JSON = function(path) {
    return new Promise((res,rej)=>{
        // console.log("GET_JSON fetch:",path);
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200) {
                return res(JSON.parse(req.responseText));
            }
            if(req.status >= 400) {
                rej(req)
            }
        };
        req.open("GET",path,true);
        req.setRequestHeader('Accept', 'application/json');
        req.withCredentials = true;
        req.send();
    });
};

export const POST_JSON = function(path,payload) {
    // console.log("POSTING",path,payload);
    return new Promise((res,rej)=> {
        let req = new XMLHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                return res(JSON.parse(req.responseText));
            }
            if (req.readyState === 4 && req.status === 400) {
                return rej(JSON.parse(req.responseText));
            }
        };
        req.open("POST", path, true);
        req.setRequestHeader('Accept', 'application/json');
        req.withCredentials = true;
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(payload));
    });
};