// Adding matcher toBeInstaceOf
jasmine.Matchers.prototype.toBeInstanceOf = function(pseudoClass){
  return this.actual instanceof pseudoClass;
};

describe("CLI Runner", function() {
  it("should work", function() {
    expect(1+1).toEqual(2);
  });
});
