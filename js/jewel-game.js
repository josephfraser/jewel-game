// Generated by CoffeeScript 1.3.3
(function() {

  if (window.eur00t == null) {
    window.eur00t = {};
  }

  if (window.eur00t.jewel == null) {
    window.eur00t.jewel = {};
  }

  /*
    Get random integer function.
    If supplied 2 arguments: result is in range [from, to]
    If 1 argument: [0, from]
  */


  window.eur00t.getRandomInt = function(from, to) {
    if (arguments.length === 2) {
      return from + Math.floor(Math.random() * (to - from + 1));
    } else if (arguments.length === 1) {
      return Math.floor(Math.random() * (from + 1));
    } else {
      return 0;
    }
  };

  /*
    Colors of gems
  */


  window.eur00t.jewel.COLORS = ['orange', 'brown', 'yellow', 'blue', 'green', 'red'];

  /*
    Main game constructor.
    
    jQueryContainer: append game to this container ($(document.body) default)
    boardW, boardH: width and height of board in item units (8x8 default)
    size: size of gem item (60 default)
    gap: gap between gems (2 default)
    border: value of gem's border
  */


  window.eur00t.jewel.Game = function(jQueryContainer, boardW, boardH, size, gap, border) {
    var i, j, _color, _i, _item, _j;
    if (jQueryContainer == null) {
      jQueryContainer = $(document.body);
    }
    if (boardW == null) {
      boardW = 8;
    }
    if (boardH == null) {
      boardH = 8;
    }
    if (size == null) {
      size = 60;
    }
    if (gap == null) {
      gap = 2;
    }
    if (border == null) {
      border = 1;
    }
    this.jQueryContainer = jQueryContainer;
    this.board = this._generateGameBoard(eur00t.compiledTemplates.jewel.board, boardW, boardH, size, gap);
    this.scoresIndicator = $(eur00t.compiledTemplates.jewel.scores());
    this.matrix = [];
    this.marks = [];
    this.size = size;
    this.gap = gap;
    this.border = border;
    this.scores = 0;
    this.boardW = boardW;
    this.boardH = boardH;
    for (i = _i = 0; 0 <= boardH ? _i < boardH : _i > boardH; i = 0 <= boardH ? ++_i : --_i) {
      this.matrix.push([]);
      this.marks.push([]);
      for (j = _j = 0; 0 <= boardW ? _j < boardW : _j > boardW; j = 0 <= boardW ? ++_j : --_j) {
        _color = eur00t.jewel.COLORS[eur00t.getRandomInt(eur00t.jewel.COLORS.length - 1)];
        _item = this._generateItem(eur00t.compiledTemplates.jewel.item, size, gap, _color, i, j, border);
        _item.data({
          i: i,
          j: j
        });
        this.matrix[i].push(_item);
        this.marks[i].push(0);
        this.board.append(_item);
      }
    }
    this._initialize();
    return this;
  };

  window.eur00t.jewel.Game.prototype._generateGameBoard = function(template, boardW, boardH, size, gap) {
    return $(template({
      width: boardW * (size + 2 * gap),
      height: boardH * (size + 2 * gap)
    }));
  };

  window.eur00t.jewel.Game.prototype._generateItem = function(template, size, gap, color, i, j, border) {
    return $(template({
      color: eur00t.jewel.COLORS[eur00t.getRandomInt(eur00t.jewel.COLORS.length - 1)],
      size: size,
      gap: gap,
      i: i,
      j: j,
      border: border
    }));
  };

  window.eur00t.jewel.Game.prototype._cancelPreviousSelect = function() {
    this.selected.obj.removeClass('selected');
    this.selected.obj = null;
    this.selected.i = -1;
    return this.selected.j = -1;
  };

  window.eur00t.jewel.Game.prototype._selectItem = function(i, j) {
    this.selected.obj = this.matrix[i][j];
    this.selected.i = i;
    this.selected.j = j;
    return this.selected.obj.addClass('selected');
  };

  window.eur00t.jewel.Game.prototype._setPosition = function(elem, i, j) {
    if (elem !== null) {
      return elem.css({
        left: this.gap + j * (this.size + 2 * this.gap) - this.border,
        top: this.gap + i * (this.size + 2 * this.gap) - this.border
      });
    }
  };

  window.eur00t.jewel.Game.prototype._swapItems = function(i0, j0, i, j) {
    var from, to, _ref;
    from = this.matrix[i0][j0];
    to = this.matrix[i][j];
    this._setPosition(from, i, j);
    this._setPosition(to, i0, j0);
    _ref = [to, from], this.matrix[i0][j0] = _ref[0], this.matrix[i][j] = _ref[1];
    from.data({
      i: i,
      j: j
    });
    return to.data({
      i: i0,
      j: j0
    });
  };

  window.eur00t.jewel.Game.prototype._initMarks = function() {
    var i, j, _i, _j, _ref, _ref1;
    for (i = _i = 0, _ref = this.boardH; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.boardW; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        this.marks[i][j] = 0;
      }
    }
    return true;
  };

  window.eur00t.jewel.Game.prototype._processStack = function(stack, i, j) {
    if (this.marks[i][j] === 0) {
      this.destroy.push({
        obj: this.matrix[i][j],
        i: i,
        j: j
      });
      this.marks[i][j] = 1;
      stack.push({
        i: i,
        j: j
      });
    }
    return true;
  };

  window.eur00t.jewel.Game.prototype._getStringExceptWords = function(string, exceptList) {
    var returnString, word, _i, _len;
    returnString = string;
    for (_i = 0, _len = exceptList.length; _i < _len; _i++) {
      word = exceptList[_i];
      returnString = returnString.replace(RegExp("" + word), '');
    }
    return returnString;
  };

  window.eur00t.jewel.Game.prototype._ifEqualType = function(i0, j0, i, j) {
    var color, color0;
    color0 = this._getStringExceptWords(this.matrix[i0][j0][0].className, ['jewel', 'selected']);
    color = this._getStringExceptWords(this.matrix[i][j][0].className, ['jewel', 'selected']);
    color0 = color0.trim(' ');
    color = color.trim(' ');
    if (color0 === color) {
      return true;
    } else {
      return false;
    }
  };

  window.eur00t.jewel.Game.prototype._destroyObj = function(obj) {
    obj.obj.fadeOut(1000);
    this.matrix[obj.i][obj.j] = null;
    return this.scores += 1;
  };

  window.eur00t.jewel.Game.prototype._processDestroyResult = function() {
    var item, _i, _len, _ref;
    if (this.destroy.length >= 2) {
      _ref = this.destroy;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this._destroyObj(item);
      }
      this.scoresIndicator.text(this.scores);
      return true;
    } else {
      return false;
    }
  };

  window.eur00t.jewel.Game.prototype._destroyDeep = function(i, j) {
    var item, stack;
    this._initMarks();
    stack = [];
    this.destroy = [];
    this._processStack(stack, i, j);
    while (item = stack.pop()) {
      if ((item.i + 1 < this.boardH) && (this.matrix[item.i + 1][item.j] !== null) && this._ifEqualType(i, j, item.i + 1, item.j)) {
        this._processStack(stack, item.i + 1, item.j);
      }
      if ((item.i - 1 >= 0) && (this.matrix[item.i - 1][item.j] !== null) && this._ifEqualType(i, j, item.i - 1, item.j)) {
        this._processStack(stack, item.i - 1, item.j);
      }
      if ((item.j + 1 < this.boardW) && (this.matrix[item.i][item.j + 1] !== null) && this._ifEqualType(i, j, item.i, item.j + 1)) {
        this._processStack(stack, item.i, item.j + 1);
      }
      if ((item.j - 1 >= 0) && (this.matrix[item.i][item.j - 1] !== null) && this._ifEqualType(i, j, item.i, item.j - 1)) {
        this._processStack(stack, item.i, item.j - 1);
      }
    }
    return this._processDestroyResult();
  };

  window.eur00t.jewel.Game.prototype._processDestroyDirection = function(i, j, iteratorI, iteratorJ, postIteration) {
    var newIterators;
    while (((0 <= iteratorI && iteratorI < this.boardH)) && ((0 <= iteratorJ && iteratorJ < this.boardW)) && (this.matrix[iteratorI][iteratorJ] !== null) && (this._ifEqualType(i, j, iteratorI, iteratorJ))) {
      this.destroy.push({
        obj: this.matrix[iteratorI][iteratorJ],
        i: iteratorI,
        j: iteratorJ
      });
      newIterators = postIteration(iteratorI, iteratorJ);
      iteratorI = newIterators.iteratorI;
      iteratorJ = newIterators.iteratorJ;
    }
    return true;
  };

  window.eur00t.jewel.Game.prototype._destroyLinearVertical = function(i, j) {
    var iteratorI, iteratorJ;
    this.destroy = [];
    iteratorI = i + 1;
    iteratorJ = j;
    this._processDestroyDirection(i, j, iteratorI, iteratorJ, function(i, j) {
      return {
        iteratorI: i + 1,
        iteratorJ: j
      };
    });
    iteratorI = i - 1;
    this._processDestroyDirection(i, j, iteratorI, iteratorJ, function(i, j) {
      return {
        iteratorI: i - 1,
        iteratorJ: j
      };
    });
    return this._processDestroyResult();
  };

  window.eur00t.jewel.Game.prototype._destroyLinearHorizontal = function(i, j) {
    var iteratorI, iteratorJ;
    this.destroy = [];
    iteratorI = i;
    iteratorJ = j + 1;
    this._processDestroyDirection(i, j, iteratorI, iteratorJ, function(i, j) {
      return {
        iteratorI: i,
        iteratorJ: j + 1
      };
    });
    iteratorJ = j - 1;
    this._processDestroyDirection(i, j, iteratorI, iteratorJ, function(i, j) {
      return {
        iteratorI: i,
        iteratorJ: j - 1
      };
    });
    return this._processDestroyResult();
  };

  window.eur00t.jewel.Game.prototype._checkIfSelectable = function(i, j) {
    if (this.selected.obj === null) {
      return true;
    } else if (((this.selected.i === i) && (Math.abs(this.selected.j - j) < 2)) || ((this.selected.j === j) && (Math.abs(this.selected.i - i) < 2))) {
      if (this._ifEqualType(i, j, this.selected.i, this.selected.j)) {
        this._cancelPreviousSelect();
        return true;
      } else {
        return false;
      }
    } else {
      this._cancelPreviousSelect();
      return true;
    }
  };

  window.eur00t.jewel.Game.prototype._compactizeBoard = function() {
    var i, iterator, j, newMatrix, _color, _fn, _i, _item, _j, _k, _l, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
      _this = this;
    newMatrix = [];
    for (j = _i = 0, _ref = this.boardW; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
      newMatrix.push([]);
      for (i = _j = _ref1 = this.boardH - 1; _ref1 <= 0 ? _j <= 0 : _j >= 0; i = _ref1 <= 0 ? ++_j : --_j) {
        if (this.matrix[i][j] !== null) {
          newMatrix[j].push(this.matrix[i][j]);
        }
      }
    }
    for (j = _k = 0, _ref2 = this.boardW; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
      iterator = 0;
      for (i = _l = _ref3 = this.boardH - 1, _ref4 = this.boardH - 1 - newMatrix[j].length; _ref3 <= _ref4 ? _l < _ref4 : _l > _ref4; i = _ref3 <= _ref4 ? ++_l : --_l) {
        this.matrix[i][j] = newMatrix[j][iterator];
        this._setPosition(this.matrix[i][j], i, j);
        this.matrix[i][j].data({
          i: i,
          j: j
        });
        iterator += 1;
      }
      if ((this.boardH - 1 - newMatrix[j].length) >= 0) {
        iterator = 1;
        _fn = function(i, j) {
          return setTimeout((function() {
            return _this._setPosition(_this.matrix[i][j], i, j);
          }), 100);
        };
        for (i = _m = _ref5 = this.boardH - 1 - newMatrix[j].length; _ref5 <= 0 ? _m <= 0 : _m >= 0; i = _ref5 <= 0 ? ++_m : --_m) {
          _color = eur00t.jewel.COLORS[eur00t.getRandomInt(eur00t.jewel.COLORS.length - 1)];
          _item = this._generateItem(eur00t.compiledTemplates.jewel.item, this.size, this.gap, _color, -iterator, j, this.border);
          this.board.append(_item);
          this.matrix[i][j] = _item;
          _fn(i, j);
          this.matrix[i][j].data({
            i: i,
            j: j
          });
          iterator += 1;
        }
      }
    }
    return true;
  };

  window.eur00t.jewel.Game.prototype._destroyAt = function(i, j) {
    var destroyedFlag;
    destroyedFlag = this._destroyLinearVertical(i, j);
    destroyedFlag = (this._destroyLinearHorizontal(i, j)) || destroyedFlag;
    if (destroyedFlag) {
      this._destroyObj({
        obj: this.matrix[i][j],
        i: i,
        j: j
      });
    }
    return destroyedFlag;
  };

  window.eur00t.jewel.Game.prototype._clearBoard = function() {
    var destroyedFlag, i, j, _i, _j, _ref, _ref1,
      _this = this;
    destroyedFlag = false;
    for (i = _i = 0, _ref = this.boardH; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.boardW; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (this.matrix[i][j] !== null) {
          destroyedFlag = (this._destroyAt(i, j)) || destroyedFlag;
        }
      }
    }
    if (destroyedFlag) {
      setTimeout((function() {
        return _this._compactizeBoard();
      }), 500);
      return setTimeout((function() {
        return _this._clearBoard();
      }), 500);
    }
  };

  window.eur00t.jewel.Game.prototype._initialize = function() {
    var _this = this;
    this.jQueryContainer.append(this.scoresIndicator);
    this.jQueryContainer.append(this.board);
    this.selected = {
      obj: null,
      i: -1,
      j: -1
    };
    this._clearBoard();
    return this.board.on('click', '.jewel', function(e) {
      var data, destroyedFlag, destroyedFlag0, i, j;
      data = ($(e.target)).data();
      i = data.i;
      j = data.j;
      if ((_this._checkIfSelectable(i, j)) || (_this._ifEqualType(i, j, _this.selected.i, _this.selected.j))) {
        return _this._selectItem(i, j);
      } else {
        _this._swapItems(i, j, _this.selected.i, _this.selected.j);
        destroyedFlag0 = _this._destroyAt(i, j);
        destroyedFlag = _this._destroyAt(_this.selected.i, _this.selected.j);
        if ((!destroyedFlag0) && (!destroyedFlag)) {
          return setTimeout((function() {
            return _this._swapItems(i, j, _this.selected.i, _this.selected.j);
          }), 300);
        } else {
          setTimeout((function() {
            _this._compactizeBoard();
            return _this._clearBoard();
          }), 500);
          return _this._cancelPreviousSelect();
        }
      }
    });
  };

}).call(this);
