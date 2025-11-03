const {installCommonGlobals} = require("jest-util");

function playFor(perf) {
    return plays[perf.playID];
}

function statement(invoice, plays) {
    const statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredit = totalVolumeCredits(statementData)
    return renderPlainText(statementData)

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance)
        result.play = playFor(result)
        result.amount = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total,p)=>total + p.volumeCredits, 0);
    }

    function totalAmount(data){
        return  data.performances.reduce((total, p)=>total+p.amount, 0)
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if (comedy === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function amountFor(aPerformance) {
        let result;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;

            case comedy:
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;

            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        // print line for this order (with newline)
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredit} credits\n`;
    return result;

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }


    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD", minimumFractionDigits: 2
        }).format(aNumber / 100);
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if (comedy === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function amountFor(aPerformance) {
        let result;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;

            case comedy:
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;

            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }

}

const comedy = "comedy";
const plays = {
    hamlet: {name: "Hamlet", type: "tragedy"},
    aslike: {name: "As You Like It", type: comedy},
    othello: {name: "Othello", type: "tragedy"}
}

const invoice = {
    customer: "BigCo",
    performances: [
        {playID: "hamlet", audience: 55},
        {playID: "aslike", audience: 35},
        {playID: "othello", audience: 40}
    ]
}


console.log(statement(invoice, plays))

module.exports = {statement}
