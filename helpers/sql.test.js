const { sqlForPartialUpdate } = require("./sql");

describe("Tesing sqlForPartialUpdate", () => {
    test("change firstName and email", ()=>{
        const { setCols, values } = sqlForPartialUpdate(
            {firstName : "cookiemonster", email : "cookie@ss.org"},
            {
            firstName: "first_name",
            email: "email",
        });

        expect(setCols).toEqual(`"first_name"=$1, "email"=$2`);
        expect(values).toEqual(["cookiemonster", "cookie@ss.org"]);
    });

});


