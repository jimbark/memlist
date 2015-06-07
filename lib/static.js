// module to modfiy static resource references to allow easy relocation to CDN etc

var baseUrl = '';

exports.map = function(name){
        return baseUrl + name;
};


