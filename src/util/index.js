Number.prototype.format = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};