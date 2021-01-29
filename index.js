'use strict';

var typescript = require('typescript');

var StripWhitespace = /** @class */ (function () {
    function StripWhitespace(options) {
        if (options === void 0) { options = {}; }
        this.shouldStripWhitespace = options.shouldStripWhitespace || returnTrue;
    }
    StripWhitespace.prototype.strip = function (code) {
        var sourceFile = typescript.createSourceFile('', code, typescript.ScriptTarget.Latest, true);
        var replacements = this.getStringReplacements(sourceFile);
        var sortedReplacements = this.sortReplacements(replacements);
        code = this.makeAllReplacements(code, sortedReplacements);
        return { code: code, replacements: sortedReplacements };
    };
    StripWhitespace.prototype.stripString = function (fatString) {
        return fatString.replace(/[\s]+/g, ' ').replace(/"/g, '\\"');
    };
    StripWhitespace.prototype.getStringReplacements = function (startingNode) {
        var _this = this;
        var stringList = [];
        var walk = this.createWalker(function (node) {
            if (node.kind !== typescript.SyntaxKind.StringLiteral) {
                return;
            }
            // make sure this string is not part of an property assignment { "a": 123 }
            if (node.parent && node.parent.kind === typescript.SyntaxKind.PropertyAssignment) {
                if (node.parent.getChildAt(0) === node) {
                    return;
                }
            }
            var text = node.text;
            if (!_this.shouldStripWhitespace(text)) {
                return;
            }
            var strippedText = _this.stripString(text);
            if (text === strippedText) {
                return;
            }
            stringList.push({
                end: node.getEnd() - 1,
                start: node.getStart() + 1,
                text: strippedText
            });
        });
        walk(startingNode);
        return this.sortReplacements(stringList);
    };
    StripWhitespace.prototype.makeAllReplacements = function (code, replacements) {
        var codeBuffer = [];
        var cursor = 0;
        for (var _i = 0, replacements_1 = replacements; _i < replacements_1.length; _i++) {
            var replacement = replacements_1[_i];
            codeBuffer.push(code.substring(cursor, replacement.start));
            codeBuffer.push(replacement.text);
            cursor = replacement.end;
        }
        codeBuffer.push(code.substring(cursor, code.length));
        return codeBuffer.join('');
    };
    StripWhitespace.prototype.sortReplacements = function (replacements) {
        return replacements.sort(function (a, b) { return a.start > b.start ? 1 : a.start < b.start ? -1 : 0; });
    };
    StripWhitespace.prototype.createWalker = function (traverser) {
        var walker = function (node) {
            traverser(node);
            typescript.forEachChild(node, walker);
        };
        return walker;
    };
    return StripWhitespace;
}());
function returnTrue() {
    return true;
}

module.exports = StripWhitespace;
//# sourceMappingURL=index.js.map
