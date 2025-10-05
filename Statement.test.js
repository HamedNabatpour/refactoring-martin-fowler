const {statement} = require("./TheaterBilling");

describe("statement function", () => {
    const plays = {
        hamlet: { name: "Hamlet", type: "tragedy" },
        aslike: { name: "As You Like It", type: "comedy" },
        othello: { name: "Othello", type: "tragedy" }
    }

    const invoice = {
        customer: "BigCo",
        performances: [
            { playID: "hamlet", audience: 55 },
            { playID: "aslike", audience: 35 },
            { playID: "othello", audience: 40 }
        ]
    }

    it("should generate the correct statement", () => {
        const result = statement(invoice, plays);

        const expected =
            `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;

        expect(result).toBe(expected);
    });
});
