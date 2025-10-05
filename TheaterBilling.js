function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        const thisAmount = amountFor(perf,play);
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every five comedy attendees
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        // print line for this order (with newline)
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function amountFor(perf,play){
    let thisAmount;
    switch (play.type) {
        case "tragedy":
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;

        case "comedy":
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;

        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}


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

console.log(statement(invoice, plays))

module.exports = {statement}
