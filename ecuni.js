/* ecuni.js */

(function (fnNS, testNS) {
    var suites = []

    if (testNS === undefined)
        testNS = fnNS

    if (fnNS === undefined)
        fnNS = this

    function describe(name, behaviors) {
        suites.push({
            name: name,
            behaviors: [],
            passed: true,
        })
        behaviors()
    }

    function it(description, behavior) {
        var suite = suites.pop()
        suite.behaviors.push({
            description: description,
            behavior: behavior,
            passed: true,
            failReason: null,
            asserts: []
        })
        suites.push(suite)
    }

    function assert(condition, description) {
        this.asserts.push({
            passed: condition,
            description: description
        })
        this.passed &&= condition
    }

    function run() {
        for (var suite of suites) {
            for (var behavior of suite.behaviors) {
                try {
                    fnNS.assert = assert.bind(behavior)
                    behavior.behavior()
                } catch (e) {
                    behavior.failReason = e
                    behavior.passed = false
                }
                suite.passed &&= behavior.passed
            }
        }
    }

    // reportCB(type, name/desc, passed)
    function report(reportCB) {
        for (var suite of suites) {
            reportCB('suite', suite.name, suite.passed)
            for (var behavior of suite.behaviors) {
                reportCB('behavior', behavior.description, behavior.passed)
                if (behavior.failReason)
                    console.log(`\t\t ‼️ ${behavior.failReason}`)
                for (var assert of behavior.asserts)
                    reportCB('assert', assert.description, assert.passed)
            }
        }
    }

    function stats() {
    }

    function reset() {
        suites = []
    }

    fnNS.describe = describe
    fnNS.it = it
    fnNS.assert = assert

    testNS.run = run
    testNS.report = report
    testNS.stats = stats
    testNS.reset = reset

})(this, this['Units'] = {})
