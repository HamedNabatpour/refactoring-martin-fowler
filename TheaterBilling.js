const {installCommonGlobals} = require("jest-util");
const createStatementData = require('./createStatementData');
function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
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
}
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber / 100);
}

module.exports = {statement}
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

