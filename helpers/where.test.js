const { getWhere } = require("./where");

describe("Tesing companies", () => {
    test("Get a company with 'of' in the name", ()=>{
        const { where, values } = getWhere({search : "of"}, "companies");

        expect(where).toEqual(`WHERE name ILIKE $1`);
        expect(values).toEqual(["%of%"]);
    });


    test("Get a company with more than 1 employee", ()=>{
        const { where, values } = getWhere({minEmployees : 2}, "companies");

        expect(where).toEqual(`WHERE num_employees >= $1`);
        expect(values).toEqual([2]);
    });


    test("Get a company with only 1 employee", ()=>{
        const { where, values } = getWhere({maxEmployees : 1}, "companies");

        expect(where).toEqual(`WHERE num_employees <= $1`);
        expect(values).toEqual([1]);
    });


    test("Get a 'of' company with 2-3 employees", ()=>{
        const { where, values } = getWhere({maxEmployees : 3, minEmployees : 2, search : 'of'}, "companies");

        expect(where).toEqual(`WHERE name ILIKE $1 AND num_employees >= $2 AND num_employees <= $3`);
        expect(values).toEqual(["%of%", 2, 3]);
    });

});

describe("Tesing jobs", () => {
    test("Get a job title with 'b3' in the name", ()=>{
        const { where, values } = getWhere({search : "b3"}, "jobs");

        expect(where).toEqual(`WHERE title ILIKE $1`);
        expect(values).toEqual(["%b3%"]);
    });


    test("Get a minimum salaries of 160000", ()=>{
        const { where, values } = getWhere({minSalary : 160000}, "jobs");

        expect(where).toEqual(`WHERE salary >= $1`);
        expect(values).toEqual([160000]);
    });


    test("Get jobs with equity", ()=>{
        const { where, values } = getWhere({hasEquity : true}, "jobs");
        expect(where).toEqual(`WHERE equity > 0`);
    });


    test("Get a 'b3' title with min salary of 160000, and equity", ()=>{
        const { where, values } = getWhere({minSalary : 160000, hasEquity : true, search : 'b3'}, "jobs");

        expect(where).toEqual(`WHERE title ILIKE $1 AND salary >= $2 AND equity > 0`);
        expect(values).toEqual(["%b3%", 160000]);
    });

});


