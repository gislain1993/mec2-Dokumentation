"use strict";
/**
 * g2.core (c) 2013-19 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * @typedef {g2}
 * @param {object} [opts] Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel.
 * @description Create a 2D graphics command queue object. Call without using 'new'.
 * @returns {g2}
 * @example
 * const ctx = document.getElementById("c").getContext("2d");
 * g2()                                   // Create 'g2' instance.
 *     .lin({x1:50,y1:50,x2:100,y2:100})  // Append ...
 *     .lin({x1:100,y1:100,x2:200,y2:50}) // ... commands.
 *     .exe(ctx);                         // Execute commands addressing canvas context.
 */
function g2(opts) {
    let o = Object.create(g2.prototype);
    o.commands = [];
    if (opts)
        Object.assign(o, opts);
    return o
}
g2.prototype = {
    clr() {
        return this.addCommand({
            c: "clr"
        })
    },
    view({scl: scl, x: x, y: y, cartesian: cartesian}) {
        return this.addCommand({
            c: "view",
            a: arguments[0]
        })
    },
    grid({color: color, size: size}={}) {
        return this.addCommand({
            c: "grid",
            a: arguments[0]
        })
    },
    cir({x: x, y: y, r: r, w: w}) {
        return this.addCommand({
            c: "cir",
            a: arguments[0]
        })
    },
    ell({x: x, y: y, rx: rx, ry: ry, w: w, dw: dw, rot: rot}) {
        return this.addCommand({
            c: "ell",
            a: arguments[0]
        })
    },
    arc({x: x, y: y, r: r, w: w, dw: dw}) {
        return this.addCommand({
            c: "arc",
            a: arguments[0]
        })
    },
    rec({x: x, y: y, b: b, h: h}) {
        return this.addCommand({
            c: "rec",
            a: arguments[0]
        })
    },
    lin({x1: x1, y1: y1, x2: x2, y2: y2}) {
        return this.addCommand({
            c: "lin",
            a: arguments[0]
        })
    },
    ply({pts: pts, format: format, closed: closed, x: x, y: y, w: w}) {
        arguments[0]._itr = format && g2.pntIterator[format](pts) || g2.pntItrOf(pts);
        return this.addCommand({
            c: "ply",
            a: arguments[0]
        })
    },
    txt({str: str, x: x, y: y, w: w}) {
        return this.addCommand({
            c: "txt",
            a: arguments[0]
        })
    },
    use({grp: grp, x: x, y: y, w: w, scl: scl}) {
        if (typeof grp === "string")
            arguments[0].grp = grp = g2.symbol[grp];
        if (grp && grp !== this)
            this.addCommand({
                c: "use",
                a: arguments[0]
            });
        return this
    },
    img({uri: uri, x: x, y: y, b: b, h: h, sx: sx, sy: sy, sb: sb, sh: sh, xoff: xoff, yoff: yoff, w: w, scl: scl}) {
        return this.addCommand({
            c: "img",
            a: arguments[0]
        })
    },
    beg({x: x, y: y, w: w, scl: scl, matrix: matrix}={}) {
        return this.addCommand({
            c: "beg",
            a: arguments[0]
        })
    },
    end() {
        let myBeg = 1,
            findMyBeg = cmd => {
                if (cmd.c === "beg")
                    myBeg--;
                else if (cmd.c === "end")
                    myBeg++;
                return myBeg === 0
            };
        return g2.getCmdIdx(this.commands, findMyBeg) !== false ? this.addCommand({
            c: "end"
        }) : this
    },
    p() {
        return this.addCommand({
            c: "p"
        })
    },
    z() {
        return this.addCommand({
            c: "z"
        })
    },
    m({x: x, y: y}) {
        return this.addCommand({
            c: "m",
            a: arguments[0]
        })
    },
    l({x: x, y: y}) {
        return this.addCommand({
            c: "l",
            a: arguments[0]
        })
    },
    q({x1: x1, y1: y1, x: x, y: y}) {
        return this.addCommand({
            c: "q",
            a: arguments[0]
        })
    },
    c({x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y}) {
        return this.addCommand({
            c: "c",
            a: arguments[0]
        })
    },
    a({dw: dw, x: x, y: y}) {
        let prvcmd = this.commands[this.commands.length - 1];
        g2.cpyProp(prvcmd.a, "x", arguments[0], "_xp");
        g2.cpyProp(prvcmd.a, "y", arguments[0], "_yp");
        return this.addCommand({
            c: "a",
            a: arguments[0]
        })
    },
    stroke({d: d}={}) {
        return this.addCommand({
            c: "stroke",
            a: arguments[0]
        })
    },
    fill({d: d}={}) {
        return this.addCommand({
            c: "fill",
            a: arguments[0]
        })
    },
    drw({d: d, lsh: lsh}={}) {
        return this.addCommand({
            c: "drw",
            a: arguments[0]
        })
    },
    del(idx) {
        this.commands.length = idx || 0;
        return this
    },
    ins(fn) {
        return typeof fn === "function" ? fn(this) || this : typeof fn === "object" ? (this.commands.push({
            c: "ins",
            a: fn
        }), this) : this
    },
    exe(ctx) {
        let handler = g2.handler(ctx);
        if (handler && handler.init(this))
            handler.exe(this.commands);
        return this
    },
    addCommand({c: c, a: a}) {
        if (a && Object.getPrototypeOf(a) === Object.prototype) {
            for (const key in a)
                if (!Object.getOwnPropertyDescriptor(a, key).get && key[0] !== "_" && typeof a[key] === "function") {
                    Object.defineProperty(a, key, {
                        get: a[key],
                        enumerable: true,
                        configurable: true,
                        writabel: false
                    })
                }
            if (g2.prototype[c].prototype)
                Object.setPrototypeOf(a, g2.prototype[c].prototype)
        }
        this.commands.push(arguments[0]);
        return this
    }
};
g2.defaultStyle = {
    fs: "transparent",
    ls: "#000",
    lw: 1,
    lc: "butt",
    lj: "miter",
    ld: [],
    ml: 10,
    sh: [0, 0],
    lsh: false,
    font: "14px serif",
    thal: "start",
    tval: "alphabetic"
};
g2.symbol = {};
g2.handler = function(ctx) {
    let hdl;
    for (let h of g2.handler.factory)
        if ((hdl = h(ctx)) !== false)
            return hdl;
    return false
};
g2.handler.factory = [];
g2.pntIterator = {
    "x,y": function(pts) {
        function pitr(i) {
            return {
                x: pts[2 * i],
                y: pts[2 * i + 1]
            }
        }
        Object.defineProperty(pitr, "len", {
            get: () => pts.length / 2,
            enumerable: true,
            configurable: true,
            writabel: false
        });
        return pitr
    },
    "[x,y]": function(pts) {
        function pitr(i) {
            return pts[i] ? {
                x: pts[i][0],
                y: pts[i][1]
            } : undefined
        }
        Object.defineProperty(pitr, "len", {
            get: () => pts.length,
            enumerable: true,
            configurable: true,
            writabel: false
        });
        return pitr
    },
    "{x,y}": function(pts) {
        function pitr(i) {
            return pts[i]
        }
        Object.defineProperty(pitr, "len", {
            get: () => pts.length,
            enumerable: true,
            configurable: true,
            writabel: false
        });
        return pitr
    }
};
g2.pntItrOf = function(pts) {
    return !(pts && pts.length) ? undefined : typeof pts[0] === "number" ? g2.pntIterator["x,y"](pts) : Array.isArray(pts[0]) && pts[0].length >= 2 ? g2.pntIterator["[x,y]"](pts) : typeof pts[0] === "object" && "x" in pts[0] && "y" in pts[0] ? g2.pntIterator["{x,y}"](pts) : undefined
};
g2.getCmdIdx = function(cmds, callbk) {
    for (let i = cmds.length - 1; i >= 0; i--)
        if (callbk(cmds[i], i, cmds))
            return i;
    return false
};
g2.mixin = function mixin(obj, ...protos) {
    protos.forEach(p => {Object.keys(p).forEach(k => {Object.defineProperty(obj, k, Object.getOwnPropertyDescriptor(p, k))})});
    return obj
};
g2.cpyProp = function(from, fromKey, to, toKey) {
    Object.defineProperty(to, toKey, Object.getOwnPropertyDescriptor(from, fromKey))
};
g2.canvasHdl = function(ctx) {
    if (this instanceof g2.canvasHdl) {
        if (ctx instanceof CanvasRenderingContext2D) {
            this.ctx = ctx;
            this.cur = g2.defaultStyle;
            this.stack = [this.cur];
            this.matrix = [[1, 0, 0, 1, .5, .5]];
            this.gridBase = 2;
            this.gridExp = 1;
            return this
        } else
            return null
    }
    return g2.canvasHdl.apply(Object.create(g2.canvasHdl.prototype), arguments)
};
g2.handler.factory.push(ctx => ctx instanceof g2.canvasHdl ? ctx : ctx instanceof CanvasRenderingContext2D ? g2.canvasHdl(ctx) : false);
g2.canvasHdl.prototype = {
    init(grp, style) {
        this.stack.length = 1;
        this.matrix.length = 1;
        this.initStyle(style ? Object.assign({}, this.cur, style) : this.cur);
        return true
    },
    async exe(commands) {
        for (let cmd of commands) {
            if (cmd.c && this[cmd.c]) {
                const rx = this[cmd.c](cmd.a);
                if (rx && rx instanceof Promise) {
                    await rx
                }
            } else if (cmd.a && "g2" in cmd.a)
                this.exe(cmd.a.g2().commands)
        }
    },
    view({x: x=0, y: y=0, scl: scl=1, cartesian: cartesian=false}) {
        this.pushTrf(cartesian ? [scl, 0, 0, -scl, x, this.ctx.canvas.height - 1 - y] : [scl, 0, 0, scl, x, y])
    },
    grid({color: color="#ccc", size: size}={}) {
        let ctx = this.ctx,
            b = ctx.canvas.width,
            h = ctx.canvas.height,
            {x: x, y: y, scl: scl} = this.uniTrf,
            sz = size || this.gridSize(scl),
            xoff = x % sz,
            yoff = y % sz;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = xoff, nx = b + 1; x < nx; x += sz) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h)
        }
        for (let y = yoff, ny = h + 1; y < ny; y += sz) {
            ctx.moveTo(0, y);
            ctx.lineTo(b, y)
        }
        ctx.stroke();
        ctx.restore()
    },
    clr({b: b, h: h}={}) {
        let ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, b || ctx.canvas.width, h || ctx.canvas.height);
        ctx.restore()
    },
    cir({x: x=0, y: y=0, r: r}) {
        this.ctx.beginPath();
        this.ctx.arc(x || 0, y || 0, Math.abs(r), 0, 2 * Math.PI, true);
        this.drw(arguments[0])
    },
    arc({x: x=0, y: y=0, r: r, w: w=0, dw: dw=2 * Math.PI}) {
        if (Math.abs(dw) > Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.abs(r), w, w + dw, dw < 0);
            this.drw(arguments[0])
        } else if (Math.abs(dw) < Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            const cw = Math.cos(w),
                sw = Math.sin(w);
            this.ctx.beginPath();
            this.ctx.moveTo(x - r * cw, y - r * sw);
            this.ctx.lineTo(x + r * cw, y + r * sw)
        }
    },
    ell({x: x=0, y: y=0, rx: rx, ry: ry, w: w=0, dw: dw=2 * Math.PI, rot: rot=0}) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, w, w + dw, dw < 0);
        this.drw(arguments[0])
    },
    rec({x: x=0, y: y=0, b: b, h: h}) {
        let tmp = this.setStyle(arguments[0]);
        this.ctx.fillRect(x, y, b, h);
        this.ctx.strokeRect(x, y, b, h);
        this.resetStyle(tmp)
    },
    lin({x1: x1=0, y1: y1=0, x2: x2, y2: y2}) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        this.stroke(arguments[0])
    },
    ply: function({pts: pts, closed: closed, x: x=0, y: y=0, w: w=0, _itr: _itr}) {
        if (_itr && _itr.len) {
            let p,
                i,
                len = _itr.len,
                istrf = !!(x || y || w),
                cw,
                sw;
            if (istrf)
                this.setTrf([cw = w ? Math.cos(w) : 1, sw = w ? Math.sin(w) : 0, -sw, cw, x || 0, y || 0]);
            this.ctx.beginPath();
            this.ctx.moveTo((p = _itr(0)).x, p.y);
            for (i = 1; i < len; i++)
                this.ctx.lineTo((p = _itr(i)).x, p.y);
            if (closed)
                this.ctx.closePath();
            this.drw(arguments[0]);
            if (istrf)
                this.resetTrf();
            return i - 1
        }
        return 0
    },
    txt({str: str, x: x=0, y: y=0, w: w=0, unsizable: unsizable}) {
        let tmp = this.setStyle(arguments[0]),
            sw = w ? Math.sin(w) : 0,
            cw = w ? Math.cos(w) : 1,
            trf = this.isCartesian ? [cw, sw, sw, -cw, x, y] : [cw, sw, -sw, cw, x, y];
        this.setTrf(unsizable ? this.concatTrf(this.unscaleTrf({
            x: x,
            y: y
        }), trf) : trf);
        if (this.ctx.fillStyle === "rgba(0, 0, 0, 0)") {
            this.ctx.fillStyle = this.ctx.strokeStyle;
            tmp.fs = "transparent"
        }
        this.ctx.fillText(str, 0, 0);
        this.resetTrf();
        this.resetStyle(tmp)
    },
    errorImageStr: "data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7",
    images: Object.create(null),
    async loadImage(uri) {
        const download = async xuri => {
            const pimg = new Promise((resolve, reject) => {
                let img = new Image;
                img.src = xuri;
                function error(err) {
                    img.removeEventListener("load", load);
                    img = undefined;
                    reject(err)
                }
                function load() {
                    img.removeEventListener("error", error);
                    resolve(img);
                    img = undefined
                }
                img.addEventListener("error", error, {
                    once: true
                });
                img.addEventListener("load", load, {
                    once: true
                })
            });
            try {
                return await pimg
            } catch (err) {
                if (xuri === this.errorImageStr) {
                    throw err
                } else {
                    return await download(this.errorImageStr)
                }
            }
        };
        let img = this.images[uri];
        if (img !== undefined) {
            return img instanceof Promise ? await img : img
        }
        img = download(uri);
        this.images[uri] = img;
        try {
            img = await img
        } finally {
            this.images[uri] = img
        }
        return img
    },
    async img({uri: uri, x: x=0, y: y=0, b: b, h: h, sx: sx=0, sy: sy=0, sb: sb, sh: sh, xoff: xoff=0, yoff: yoff=0, w: w=0, scl: scl=1}) {
        const img_ = await this.loadImage(uri);
        this.ctx.save();
        const cart = this.isCartesian ? -1 : 1;
        sb = sb || img_.width;
        b = b || img_.width;
        sh = sh || img_.height;
        h = (h || img_.height) * cart;
        yoff *= cart;
        w *= cart;
        y = this.isCartesian ? -(y / scl) + sy : y / scl;
        const [cw, sw] = [Math.cos(w), Math.sin(w)];
        this.ctx.scale(scl, scl * cart);
        this.ctx.transform(cw, sw, -sw, cw, x / scl, y);
        this.ctx.drawImage(img_, sx, sy, sb, sh, xoff, yoff, b, h);
        this.ctx.restore()
    },
    use({grp: grp}) {
        this.beg(arguments[0]);
        this.exe(grp.commands);
        this.end()
    },
    beg({x: x=0, y: y=0, w: w=0, scl: scl=1, matrix: matrix, unsizable: unsizable}={}) {
        let trf = matrix;
        if (!trf) {
            let ssw,
                scw;
            ssw = w ? Math.sin(w) * scl : 0;
            scw = w ? Math.cos(w) * scl : scl;
            trf = [scw, ssw, -ssw, scw, x, y]
        }
        this.pushStyle(arguments[0]);
        this.pushTrf(unsizable ? this.concatTrf(this.unscaleTrf({
            x: x,
            y: y
        }), trf) : trf)
    },
    end() {
        this.popTrf();
        this.popStyle()
    },
    p() {
        this.ctx.beginPath()
    },
    z() {
        this.ctx.closePath()
    },
    m({x: x, y: y}) {
        this.ctx.moveTo(x, y)
    },
    l({x: x, y: y}) {
        this.ctx.lineTo(x, y)
    },
    q({x: x, y: y, x1: x1, y1: y1}) {
        this.ctx.quadraticCurveTo(x1, y1, x, y)
    },
    c({x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2}) {
        this.ctx.bezierCurveTo(x1, y1, x2, y2, x, y)
    },
    a({x: x, y: y, dw: dw, k: k, phi: phi, _xp: _xp, _yp: _yp}) {
        if (k === undefined)
            k = 1;
        if (Math.abs(dw) > Number.EPSILON) {
            if (k === 1) {
                let x12 = x - _xp,
                    y12 = y - _yp;
                let tdw_2 = Math.tan(dw / 2),
                    rx = (x12 - y12 / tdw_2) / 2,
                    ry = (y12 + x12 / tdw_2) / 2,
                    R = Math.hypot(rx, ry),
                    w = Math.atan2(-ry, -rx);
                this.ctx.ellipse(_xp + rx, _yp + ry, R, R, 0, w, w + dw, this.cartesian ? dw > 0 : dw < 0)
            } else {
                if (phi === undefined)
                    phi = 0;
                let x1 = dw > 0 ? _xp : x,
                    y1 = dw > 0 ? _yp : y,
                    x2 = dw > 0 ? x : _xp,
                    y2 = dw > 0 ? y : _yp;
                let x12 = x2 - x1,
                    y12 = y2 - y1,
                    _dw = dw < 0 ? dw : -dw;
                let cp = phi ? Math.cos(phi) : 1,
                    sp = phi ? Math.sin(phi) : 0,
                    dx = -x12 * cp - y12 * sp,
                    dy = -x12 * sp - y12 * cp,
                    sdw_2 = Math.sin(_dw / 2),
                    R = Math.sqrt((dx * dx + dy * dy / (k * k)) / (4 * sdw_2 * sdw_2)),
                    w = Math.atan2(k * dx, dy) - _dw / 2,
                    x0 = x1 - R * Math.cos(w),
                    y0 = y1 - R * k * Math.sin(w);
                this.ctx.ellipse(x0, y0, R, R * k, phi, w, w + dw, this.cartesian ? dw > 0 : dw < 0)
            }
        } else
            this.ctx.lineTo(x, y)
    },
    stroke({d: d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.stroke(new Path2D(d)) : this.ctx.stroke();
        this.resetStyle(tmp)
    },
    fill({d: d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.fill(new Path2D(d)) : this.ctx.fill();
        this.resetStyle(tmp)
    },
    drw({d: d, lsh: lsh}={}) {
        let ctx = this.ctx,
            tmp = this.setStyle(arguments[0]),
            p = d && new Path2D(d);
        d ? ctx.fill(p) : ctx.fill();
        if (ctx.shadowColor !== "rgba(0, 0, 0, 0)" && ctx.fillStyle !== "rgba(0, 0, 0, 0)" && !lsh) {
            let shc = ctx.shadowColor;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
            d ? ctx.stroke(p) : ctx.stroke();
            ctx.shadowColor = shc
        } else
            d ? ctx.stroke(p) : ctx.stroke();
        this.resetStyle(tmp)
    },
    get: {
        fs: ctx => ctx.fillStyle,
        ls: ctx => ctx.strokeStyle,
        lw: ctx => ctx.lineWidth,
        lc: ctx => ctx.lineCap,
        lj: ctx => ctx.lineJoin,
        ld: ctx => ctx.getLineDash(),
        ml: ctx => ctx.miterLimit,
        sh: ctx => [ctx.shadowOffsetX || 0, ctx.shadowOffsetY || 0, ctx.shadowBlur || 0, ctx.shadowColor || "black"],
        font: ctx => ctx.font,
        thal: ctx => ctx.textAlign,
        tval: ctx => ctx.textBaseline
    },
    set: {
        fs: (ctx, q) => {ctx.fillStyle = q},
        ls: (ctx, q) => {ctx.strokeStyle = q},
        lw: (ctx, q) => {ctx.lineWidth = q},
        lc: (ctx, q) => {ctx.lineCap = q},
        lj: (ctx, q) => {ctx.lineJoin = q},
        ld: (ctx, q) => {ctx.setLineDash(q)},
        ml: (ctx, q) => {ctx.miterLimit = q},
        sh: (ctx, q) => {
            if (q) {
                ctx.shadowOffsetX = q[0] || 0;
                ctx.shadowOffsetY = q[1] || 0;
                ctx.shadowBlur = q[2] || 0;
                ctx.shadowColor = q[3] || "black"
            }
        },
        font: (ctx, q) => {ctx.font = q},
        thal: (ctx, q) => {ctx.textAlign = q},
        tval: (ctx, q) => {ctx.textBaseline = q}
    },
    initStyle(style) {
        for (const key in style)
            if (this.get[key] && this.get[key](this.ctx) !== style[key])
                this.set[key](this.ctx, style[key])
    },
    setStyle(style) {
        let q,
            prv = {};
        for (const key in style) {
            if (this.get[key]) {
                if (typeof style[key] === "string" && style[key][0] === "@") {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](this.ctx)
                }
                if ((q = this.get[key](this.ctx)) !== style[key]) {
                    prv[key] = q;
                    this.set[key](this.ctx, style[key])
                }
            }
        }
        return prv
    },
    resetStyle(style) {
        for (const key in style)
            this.set[key](this.ctx, style[key])
    },
    pushStyle(style) {
        let cur = {};
        for (const key in style)
            if (this.get[key]) {
                if (typeof style[key] === "string" && style[key][0] === "@") {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](this.ctx)
                }
                if (this.cur[key] !== style[key])
                    this.set[key](this.ctx, cur[key] = style[key])
            }
        this.stack.push(this.cur = Object.assign({}, this.cur, cur))
    },
    popStyle() {
        let cur = this.stack.pop();
        this.cur = this.stack[this.stack.length - 1];
        for (const key in this.cur)
            if (this.get[key] && this.cur[key] !== cur[key])
                this.set[key](this.ctx, this.cur[key])
    },
    concatTrf(q, t) {
        return [q[0] * t[0] + q[2] * t[1], q[1] * t[0] + q[3] * t[1], q[0] * t[2] + q[2] * t[3], q[1] * t[2] + q[3] * t[3], q[0] * t[4] + q[2] * t[5] + q[4], q[1] * t[4] + q[3] * t[5] + q[5]]
    },
    initTrf() {
        this.ctx.setTransform(...this.matrix[0])
    },
    setTrf(t) {
        this.ctx.setTransform(...this.concatTrf(this.matrix[this.matrix.length - 1], t))
    },
    resetTrf() {
        this.ctx.setTransform(...this.matrix[this.matrix.length - 1])
    },
    pushTrf(t) {
        let q_t = this.concatTrf(this.matrix[this.matrix.length - 1], t);
        this.matrix.push(q_t);
        this.ctx.setTransform(...q_t)
    },
    popTrf() {
        this.matrix.pop();
        this.ctx.setTransform(...this.matrix[this.matrix.length - 1])
    },
    get isCartesian() {
        let m = this.matrix[this.matrix.length - 1];
        return m[0] * m[3] - m[1] * m[2] < 0
    },
    get uniTrf() {
        let m = this.matrix[this.matrix.length - 1];
        return {
            x: m[4],
            y: m[5],
            scl: Math.hypot(m[0], m[1]),
            cartesian: m[0] * m[3] - m[1] * m[2] < 0
        }
    },
    unscaleTrf({x: x, y: y}) {
        let m = this.matrix[this.matrix.length - 1],
            invscl = 1 / Math.hypot(m[0], m[1]);
        return [invscl, 0, 0, invscl, (1 - invscl) * x, (1 - invscl) * y]
    },
    gridSize(scl) {
        let base = this.gridBase,
            exp = this.gridExp,
            sz;
        while ((sz = scl * base * Math.pow(10, exp)) < 14 || sz > 35) {
            if (sz < 14) {
                if (base == 1)
                    base = 2;
                else if (base == 2)
                    base = 5;
                else if (base == 5) {
                    base = 1;
                    exp++
                }
            } else {
                if (base == 1) {
                    base = 5;
                    exp--
                } else if (base == 2)
                    base = 1;
                else if (base == 5)
                    base = 2
            }
        }
        this.gridBase = base;
        this.gridExp = exp;
        return sz
    }
};
g2.zoomView = function({scl: scl, x: x, y: y}) {
    return {
        scl: scl,
        x: (1 - scl) * x,
        y: (1 - scl) * y
    }
};
g2.render = function render(fn) {
    function animate(t) {
        if (fn(t))
            requestAnimationFrame(animate)
    }
    animate(performance.now())
};
if (typeof module !== "undefined")
    module.exports = g2;
/**
 * g2.lib (c) 2013-17 Stefan Goessner
 * geometric constants and higher functions
 * @license MIT License
 * @link https://github.com/goessner/g2
 */
"use strict";
var g2 = g2 || {};
g2 = Object.assign(g2, {
    EPS: Number.EPSILON,
    PI: Math.PI,
    PI2: 2 * Math.PI,
    SQRT2: Math.SQRT2,
    SQRT2_2: Math.SQRT2 / 2,
    toPi2(w) {
        return (w % g2.PI2 + g2.PI2) % g2.PI2
    },
    toPi(w) {
        return (w = (w % g2.PI2 + g2.PI2) % g2.PI2) > g2.PI ? w - g2.PI2 : w
    },
    toArc: function(w, w0, dw) {
        if (dw > g2.EPS || dw < -g2.EPS) {
            if (w0 > w && w0 + dw > g2.PI2)
                w0 -= g2.PI2;
            else if (w0 < w && w0 + dw < 0)
                w0 += g2.PI2;
            return (w - w0) / dw
        }
        return 0
    },
    isPntOnLin({x: x, y: y}, p1, p2, eps=Number.EPSILON) {
        let dx = p2.x - p1.x,
            dy = p2.y - p1.y,
            dx2 = x - p1.x,
            dy2 = y - p1.y,
            dot = dx * dx2 + dy * dy2,
            perp = dx * dy2 - dy * dx2,
            len = Math.hypot(dx, dy),
            epslen = eps * len;
        return -epslen < perp && perp < epslen && -epslen < dot && dot < len * (len + eps)
    },
    isPntOnCir({x: xp, y: yp}, {x: x, y: y, r: r}, eps=Number.EPSILON) {
        let dx = xp - x,
            dy = yp - y,
            ddis = dx * dx + dy * dy - r * r,
            reps = eps * r;
        return -reps < ddis && ddis < reps
    },
    isPntOnArc({x: xp, y: yp}, {x: x, y: y, r: r, w: w, dw: dw}, eps=Number.EPSILON) {
        var dx = xp - x,
            dy = yp - y,
            dist = Math.hypot(dx, dy),
            mu = g2.toArc(g2.toPi2(Math.atan2(dy, dx)), g2.toPi2(w), dw);
        return r * Math.abs(dw) > eps && Math.abs(dist - r) < eps && mu >= 0 && mu <= 1
    },
    isPntOnPly({x: x, y: y}, {pts: pts, closed: closed}, eps=Number.EPSILON) {
        for (var i = 0, n = pts.length; i < (closed ? n : n - 1); i++)
            if (g2.isPntOnLin({
                x: x,
                y: y
            }, pts[i], pts[(i + 1) % n], eps))
                return true;
        return false
    },
    isPntOnBox({x: xp, y: yp}, {x: x, y: y, b: b, h: h}, eps=Number.EPSILON) {
        var dx = x.p - x,
            dy = yp - y;
        return dx >= b - eps && dx <= b + eps && dy <= h + eps && dy >= -h - eps || dx >= -b - eps && dx <= b + eps && dy <= h + eps && dy >= h - eps || dx >= -b - eps && dx <= -b + eps && dy <= h + eps && dy >= -h - eps || dx >= -b - eps && dx <= b + eps && dy <= -h + eps && dy >= -h - eps
    },
    isPntInCir({x: xp, y: yp}, {x: x, y: y, r: r}) {
        return (x - xp) ** 2 + (y - yp) ** 2 < r * r
    },
    isPntInPly({x: x, y: y}, {pts: pts, closed: closed}, eps=Number.EPSILON) {
        let match = 0;
        for (let n = pts.length, i = 0, pi = pts[i], pj = pts[n - 1]; i < n; pj = pi, pi = pts[++i])
            if ((y > pi.y || y > pj.y) && (y <= pi.y || y <= pj.y) && (x <= pi.x || x <= pj.x) && pi.y !== pj.y && (pi.x === pj.x || x <= pj.x + (y - pj.y) * (pi.x - pj.x) / (pi.y - pj.y)))
                match++;
        return match % 2 != 0
    },
    isPntInBox({x: xp, y: yp}, {x: x, y: y, b: b, h: h}) {
        var dx = xp - x,
            dy = yp - y;
        return dx >= -b && dx <= b && dy >= -h && dy <= h
    },
    arc3pts(x1, y1, x2, y2, x3, y3) {
        const dx1 = x2 - x1,
            dy1 = y2 - y1;
        const dx2 = x3 - x2,
            dy2 = y3 - y2;
        const den = dx1 * dy2 - dy1 * dx2;
        const lam = Math.abs(den) > Number.EPSILON ? .5 * ((dx1 + dx2) * dx2 + (dy1 + dy2) * dy2) / den : 0;
        const x0 = lam ? x1 + .5 * dx1 - lam * dy1 : x1 + .5 * (dx1 + dx2);
        const y0 = lam ? y1 + .5 * dy1 + lam * dx1 : y1 + .5 * (dy1 + dy2);
        const dx01 = x1 - x0,
            dy01 = y1 - y0;
        const dx03 = x3 - x0,
            dy03 = y3 - y0;
        const dw = lam ? Math.atan2(dx01 * dy03 - dy01 * dx03, dx01 * dx03 + dy01 * dy03) : 0;
        const r = dw ? Math.hypot(dy01, dx01) : .5 * Math.hypot(dy1 + dy2, dx1 + dx2);
        return {
            x: x0,
            y: y0,
            r: r,
            w: Math.atan2(dy01, dx01),
            dw: dw
        }
    }
});
"use strict";
/**
 * g2.ext (c) 2015-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @typedef {g2}
 * @description Additional methods for g2.
 * @returns {g2}
 */
var g2 = g2 || {
    prototype: {}
};
g2.NONE = 0;
g2.OVER = 1;
g2.DRAG = 2;
g2.EDIT = 4;
g2.prototype.lin.prototype = {
    isSolid: false,
    get len() {
        return Math.hypot(this.x2 - this.x1, this.y2 - this.y1)
    },
    get sh() {
        return this.state & g2.OVER ? [0, 0, 5, "black"] : false
    },
    pointAt(loc) {
        let t = loc === "beg" ? 0 : loc === "end" ? 1 : loc + 0 === loc ? loc : .5,
            dx = this.x2 - this.x1,
            dy = this.y2 - this.y1,
            len = Math.hypot(dx, dy);
        return {
            x: this.x1 + dx * t,
            y: this.y1 + dy * t,
            dx: len ? dx / len : 1,
            dy: len ? dy / len : 0
        }
    },
    hitContour({x: x, y: y, eps: eps}) {
        return g2.isPntOnLin({
            x: x,
            y: y
        }, {
            x: this.x1,
            y: this.y1
        }, {
            x: this.x2,
            y: this.y2
        }, eps)
    },
    drag({dx: dx, dy: dy}) {
        this.x1 += dx;
        this.x2 += dx;
        this.y1 += dy;
        this.y2 += dy
    },
    handles(grp) {
        grp.handle({
            x: this.x1,
            y: this.y1,
            _update: ({dx: dx, dy: dy}) => {
                this.x1 += dx;
                this.y1 += dy
            }
        }).handle({
            x: this.x2,
            y: this.y2,
            _update: ({dx: dx, dy: dy}) => {
                this.x2 += dx;
                this.y2 += dy
            }
        })
    }
};
g2.prototype.rec.prototype = {
    _dir: {
        c: [0, 0],
        e: [1, 0],
        ne: [1, 1],
        n: [0, 1],
        nw: [-1, 1],
        w: [-1, 0],
        sw: [-1, -1],
        s: [0, -1],
        se: [1, -1]
    },
    get len() {
        return 2 * (this.b + this.h)
    },
    get isSolid() {
        return this.fs && this.fs !== "transparent"
    },
    get len() {
        return 2 * Math.PI * this.r
    },
    get lsh() {
        return this.state & g2.OVER
    },
    get sh() {
        return this.state & g2.OVER ? [0, 0, 5, "black"] : false
    },
    pointAt(loc) {
        const q = this._dir[loc || "c"] || this._dir["c"],
            nx = q[0],
            ny = q[1];
        return {
            x: this.x + (1 + nx) * this.b / 2,
            y: this.y + (1 + ny) * this.h / 2,
            dx: -ny,
            dy: nx
        }
    },
    hitContour({x: x, y: y, eps: eps}) {
        return g2.isPntOnBox({
            x: x,
            y: y
        }, {
            x: this.x + this.b / 2,
            y: this.y + this.h / 2,
            b: this.b / 2,
            h: this.h / 2
        }, eps)
    },
    hitInner({x: x, y: y, eps: eps}) {
        return g2.isPntInBox({
            x: x,
            y: y
        }, {
            x: this.x + this.b / 2,
            y: this.y + this.h / 2,
            b: this.b / 2,
            h: this.h / 2
        }, eps)
    },
    drag({dx: dx, dy: dy}) {
        this.x += dx;
        this.y += dy
    }
};
g2.prototype.cir.prototype = {
    w: 0,
    _dir: {
        c: [0, 0],
        e: [1, 0],
        ne: [Math.SQRT2 / 2, Math.SQRT2 / 2],
        n: [0, 1],
        nw: [-Math.SQRT2 / 2, Math.SQRT2 / 2],
        w: [-1, 0],
        sw: [-Math.SQRT2 / 2, -Math.SQRT2 / 2],
        s: [0, -1],
        se: [Math.SQRT2 / 2, -Math.SQRT2 / 2]
    },
    get isSolid() {
        return this.fs && this.fs !== "transparent"
    },
    get len() {
        return 2 * Math.PI * this.r
    },
    get lsh() {
        return this.state & g2.OVER
    },
    get sh() {
        return this.state & g2.OVER ? [0, 0, 5, "black"] : false
    },
    pointAt(loc) {
        let q = loc + 0 === loc ? [Math.cos(loc * 2 * Math.PI), Math.sin(loc * 2 * Math.PI)] : this._dir[loc || "c"] || [0, 0],
            nx = q[0],
            ny = q[1];
        return {
            x: this.x + nx * this.r,
            y: this.y + ny * this.r,
            dx: -ny,
            dy: nx
        }
    },
    hitContour({x: x, y: y, eps: eps}) {
        return g2.isPntOnCir({
            x: x,
            y: y
        }, this, eps)
    },
    hitInner({x: x, y: y, eps: eps}) {
        return g2.isPntInCir({
            x: x,
            y: y
        }, this, eps)
    },
    drag({dx: dx, dy: dy}) {
        this.x += dx;
        this.y += dy
    },
    handles(grp) {
        const p0 = {
            x: this.x,
            y: this.y,
            _update: ({dx: dx, dy: dy}) => {
                this.x += dx;
                this.y += dy;
                p1.x += dx;
                p1.y += dy
            }
        };
        const p1 = {
            x: this.x + this.r * Math.cos(this.w || 0),
            y: this.y + this.r * Math.sin(this.w || 0),
            _info: () => `r:${this.r.toFixed(1)}<br>w:${(this.w / Math.PI * 180).toFixed(1)}°`,
            _update: ({x: x, y: y}) => {
                this.r = Math.hypot(y - this.y, x - this.x);
                this.w = Math.atan2(y - this.y, x - this.x)
            }
        };
        grp.lin({
            x1: () => this.x,
            y1: () => this.y,
            x2: () => p1.x,
            y2: () => p1.y,
            ld: [4, 3],
            ls: "#666"
        }).handle(p0).handle(p1)
    }
};
g2.prototype.arc.prototype = {
    get len() {
        return Math.abs(this.r * this.dw)
    },
    get angle() {
        return this.dw / Math.PI * 180
    },
    pointAt(loc) {
        let t = loc === "beg" ? 0 : loc === "end" ? 1 : loc === "mid" ? .5 : loc + 0 === loc ? loc : .5,
            ang = this.w + t * this.dw,
            cang = Math.cos(ang),
            sang = Math.sin(ang),
            r = loc === "c" ? 0 : this.r;
        return {
            x: this.x + r * cang,
            y: this.y + r * sang,
            dx: -sang,
            dy: cang
        }
    },
    isSolid: false,
    get sh() {
        return this.state & g2.OVER ? [0, 0, 5, "black"] : false
    },
    hitContour({x: x, y: y, eps: eps}) {
        return g2.isPntOnArc({
            x: x,
            y: y
        }, this, eps)
    },
    drag({dx: dx, dy: dy}) {
        this.x += dx;
        this.y += dy
    },
    handles(grp) {
        const p0 = {
                x: this.x,
                y: this.y,
                _update: ({dx: dx, dy: dy}) => {
                    this.x += dx;
                    this.y += dy;
                    p1.x += dx;
                    p1.y += dy;
                    p2.x += dx;
                    p2.y += dy
                }
            },
            p1 = {
                x: this.x + this.r * Math.cos(this.w),
                y: this.y + this.r * Math.sin(this.w),
                _info: () => `r:${this.r.toFixed(1)}<br>w:${(this.w / Math.PI * 180).toFixed(1)}°`,
                _update: ({x: x, y: y}) => {
                    this.r = Math.hypot(y - this.y, x - this.x);
                    this.w = Math.atan2(y - this.y, x - this.x);
                    p2.x = this.x + this.r * Math.cos(this.w + this.dw);
                    p2.y = this.y + this.r * Math.sin(this.w + this.dw)
                }
            },
            dw = this.dw,
            p2 = {
                x: this.x + this.r * Math.cos(this.w + this.dw),
                y: this.y + this.r * Math.sin(this.w + this.dw),
                _info: () => `dw:${(this.dw / Math.PI * 180).toFixed(1)}°`,
                _update: ({x: x, y: y}) => {
                    let lam = g2.toArc(g2.toPi2(Math.atan2(y - this.y, x - this.x)), g2.toPi2(this.w), dw);
                    this.dw = lam * dw
                }
            };
        if (this.w === undefined)
            this.w = 0;
        grp.lin({
            x1: () => this.x,
            y1: () => this.y,
            x2: () => p1.x,
            y2: () => p1.y,
            ld: [4, 3],
            ls: "#666"
        }).lin({
            x1: () => this.x,
            y1: () => this.y,
            x2: () => p2.x,
            y2: () => p2.y,
            ld: [4, 3],
            ls: "#666"
        }).handle(p0).handle(p1).handle(p2)
    }
};
g2.prototype.ply.prototype = {
    get isSolid() {
        return this.closed && this.fs && this.fs !== "transparent"
    },
    get sh() {
        return this.state & g2.OVER ? [0, 0, 5, "black"] : false
    },
    pointAt(loc) {
        const t = loc === "beg" ? 0 : loc === "end" ? 1 : loc + 0 === loc ? loc : .5,
            pitr = g2.pntItrOf(this.pts),
            pts = [],
            len = [];
        for (let itr = 0; itr < pitr.len; itr++) {
            const next = pitr(itr + 1) ? pitr(itr + 1) : pitr(0);
            if (itr === pitr.len - 1 && this.closed || itr < pitr.len - 1) {
                pts.push(pitr(itr));
                len.push(Math.hypot(next.x - pitr(itr).x, next.y - pitr(itr).y))
            }
        }
        const {t2: t2, x: x, y: y, dx: dx, dy: dy} = (() => {
            const target = t * len.reduce((a, b) => a + b);
            let tmp = 0;
            for (let itr = 0; itr < pts.length; itr++) {
                tmp += len[itr];
                const next = pitr(itr + 1).x ? pitr(itr + 1) : pitr(0);
                if (tmp >= target) {
                    return {
                        t2: 1 - (tmp - target) / len[itr],
                        x: pts[itr].x,
                        y: pts[itr].y,
                        dx: next.x - pts[itr].x,
                        dy: next.y - pts[itr].y
                    }
                }
            }
        })();
        const len2 = Math.hypot(dx, dy);
        return {
            x: x + dx * t2,
            y: y + dy * t2,
            dx: len2 ? dx / len2 : 1,
            dy: len2 ? dy / len2 : 0
        }
    },
    x: 0,
    y: 0,
    hitContour({x: x, y: y, eps: eps}) {
        let p = {
            x: x - this.x,
            y: y - this.y
        };
        return g2.isPntOnPly(p, this, eps)
    },
    hitInner({x: x, y: y, eps: eps}) {
        let p = {
            x: x - this.x,
            y: y - this.y
        };
        return g2.isPntInPly(p, this, eps)
    },
    drag({dx: dx, dy: dy}) {
        this.x += dx;
        this.y += dy
    },
    handles(grp) {
        let p,
            slf = this;
        for (let n = this._itr.len, i = 0; i < n; i++)
            grp.handle({
                x: (p = this._itr(i)).x + this.x,
                y: p.y + this.y,
                i: i,
                _update({dx: dx, dy: dy}) {
                    let p = slf._itr(this.i);
                    p.x += dx;
                    p.y += dy
                }
            })
    }
};
g2.prototype.use.prototype = {
    _dir: g2.prototype.cir.prototype._dir,
    r: 5,
    pointAt: g2.prototype.cir.prototype.pointAt
};
g2.prototype.spline = function spline({pts: pts, closed: closed, x: x, y: y, w: w}) {
    arguments[0]._itr = g2.pntItrOf(pts);
    return this.addCommand({
        c: "spline",
        a: arguments[0]
    })
};
g2.prototype.spline.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2: function() {
        let {pts: pts, closed: closed, x: x, y: y, w: w, ls: ls, lw: lw, fs: fs, sh: sh} = this,
            itr = this._itr,
            gbez;
        if (itr) {
            let b = [],
                i,
                n = itr.len,
                p1,
                p2,
                p3,
                p4,
                d1,
                d2,
                d3,
                d1d2,
                d2d3,
                scl2,
                scl3,
                den2,
                den3,
                istrf = x || y || w;
            gbez = g2();
            if (istrf)
                gbez.beg({
                    x: x,
                    y: y,
                    w: w
                });
            gbez.p().m(itr(0));
            for (let i = 0; i < (closed ? n : n - 1); i++) {
                if (i === 0) {
                    p1 = closed ? itr(n - 1) : {
                        x: 2 * itr(0).x - itr(1).x,
                        y: 2 * itr(0).y - itr(1).y
                    };
                    p2 = itr(0);
                    p3 = itr(1);
                    p4 = n === 2 ? closed ? itr(0) : {
                        x: 2 * itr(1).x - itr(0).x,
                        y: 2 * itr(1).y - itr(0).y
                    } : itr(2);
                    d1 = Math.max(Math.hypot(p2.x - p1.x, p2.y - p1.y), Number.EPSILON);
                    d2 = Math.max(Math.hypot(p3.x - p2.x, p3.y - p2.y), Number.EPSILON)
                } else {
                    p1 = p2;
                    p2 = p3;
                    p3 = p4;
                    p4 = i === n - 2 ? closed ? itr(0) : {
                        x: 2 * itr(n - 1).x - itr(n - 2).x,
                        y: 2 * itr(n - 1).y - itr(n - 2).y
                    } : i === n - 1 ? itr(1) : itr(i + 2);
                    d1 = d2;
                    d2 = d3
                }
                d3 = Math.max(Math.hypot(p4.x - p3.x, p4.y - p3.y), Number.EPSILON);
                d1d2 = Math.sqrt(d1 * d2), d2d3 = Math.sqrt(d2 * d3), scl2 = 2 * d1 + 3 * d1d2 + d2, scl3 = 2 * d3 + 3 * d2d3 + d2, den2 = 3 * (d1 + d1d2), den3 = 3 * (d3 + d2d3);
                gbez.c({
                    x: p3.x,
                    y: p3.y,
                    x1: (-d2 * p1.x + scl2 * p2.x + d1 * p3.x) / den2,
                    y1: (-d2 * p1.y + scl2 * p2.y + d1 * p3.y) / den2,
                    x2: (-d2 * p4.x + scl3 * p3.x + d3 * p2.x) / den3,
                    y2: (-d2 * p4.y + scl3 * p3.y + d3 * p2.y) / den3
                })
            }
            gbez.c(closed ? {
                x: itr(0).x,
                y: itr(0).y
            } : {
                x: itr(n - 1).x,
                y: itr(n - 1).y
            });
            if (closed)
                gbez.z();
            gbez.drw({
                ls: ls,
                lw: lw,
                fs: fs,
                sh: sh
            });
            if (istrf)
                gbez.end()
        }
        return gbez
    }
});
g2.prototype.label = function label({str: str, loc: loc, off: off, fs: fs, font: font, fs2: fs2}) {
    let idx = g2.getCmdIdx(this.commands, cmd => {return cmd.a && "pointAt" in cmd.a});
    if (idx !== undefined) {
        arguments[0]["_refelem"] = this.commands[idx];
        this.addCommand({
            c: "label",
            a: arguments[0]
        })
    }
    return this
};
g2.prototype.label.prototype = {
    g2() {
        let label = g2();
        if (this._refelem) {
            let {str: str, loc: loc, off: off, fs: fs, font: font, border: border, fs2: fs2} = this,
                p = this._refelem.a.pointAt(loc),
                tanlen = p.dx * p.dx || p.dy * p.dy;
            let h = parseInt(font || g2.defaultStyle.font),
                diag,
                phi,
                n;
            if (str[0] === "@" && (s = this._refelem.a[str.substr(1)]) !== undefined)
                str = "" + (Number.isInteger(+s) ? +s : Number(s).toFixed(Math.max(g2.symbol.labelSignificantDigits - Math.log10(s), 0))) + (str.substr(1) === "angle" ? "°" : "");
            n = str.length;
            if (tanlen > Number.EPSILON) {
                diag = Math.hypot(p.dx, n * p.dy);
                off = off === undefined ? 1 : off;
                p.x += tanlen * p.dy * (off + n * n * .8 * h / 2 / diag * Math.sign(off));
                p.y += tanlen * p.dx * (-off - h / 2 / diag * Math.sign(off))
            }
            fs = fs || "black";
            if (border)
                label.ell({
                    x: p.x,
                    y: p.y,
                    rx: n * .8 * h / 2 + 2,
                    ry: h / 2 + 2,
                    ls: fs || "black",
                    fs: fs2 || "#ffc"
                });
            label.txt({
                str: str,
                x: p.x,
                y: p.y,
                thal: "center",
                tval: "middle",
                fs: fs || "black",
                font: font
            })
        }
        return label
    }
};
g2.prototype.mark = function mark({mrk: mrk, loc: loc, dir: dir, fs: fs, ls: ls}) {
    let idx = g2.getCmdIdx(this.commands, cmd => {return cmd.a && "pointAt" in cmd.a});
    if (idx !== undefined) {
        arguments[0]["_refelem"] = this.commands[idx];
        this.addCommand({
            c: "mark",
            a: arguments[0]
        })
    }
    return this
};
g2.prototype.mark.prototype = {
    markAt(elem, loc, mrk, dir, ls, fs) {
        const p = elem.pointAt(loc),
            w = dir < 0 ? Math.atan2(-p.dy, -p.dx) : dir > 0 || dir === undefined ? Math.atan2(p.dy, p.dx) : 0;
        return {
            grp: mrk,
            x: p.x,
            y: p.y,
            w: w,
            scl: elem.lw || 1,
            ls: ls || elem.ls || "black",
            fs: fs || ls || elem.ls || "black"
        }
    },
    g2() {
        let {mrk: mrk, loc: loc, dir: dir, fs: fs, ls: ls} = this,
            elem = this._refelem.a,
            marks = g2();
        if (Array.isArray(loc))
            for (let l of loc)
                marks.use(this.markAt(elem, l, mrk, dir, ls, fs));
        else
            marks.use(this.markAt(elem, loc, mrk, dir, ls, fs));
        return marks
    }
};
g2.symbol = g2.symbol || {};
g2.symbol.tick = g2().p().m({
    x: 0,
    y: -2
}).l({
    x: 0,
    y: 2
}).stroke({
    lc: "round",
    lwnosc: true
});
g2.symbol.dot = g2().cir({
    x: 0,
    y: 0,
    r: 2,
    ls: "transparent"
});
g2.symbol.sqr = g2().rec({
    x: -1.5,
    y: -1.5,
    b: 3,
    h: 3,
    ls: "transparent"
});
g2.symbol.nodcolor = "#333";
g2.symbol.nodfill = "#dedede";
g2.symbol.nodfill2 = "#aeaeae";
g2.symbol.linkcolor = "#666";
g2.symbol.linkfill = "rgba(225,225,225,0.75)";
g2.symbol.dimcolor = "darkslategray";
g2.symbol.solid = [];
g2.symbol.dash = [15, 10];
g2.symbol.dot = [4, 4];
g2.symbol.dashdot = [25, 6.5, 2, 6.5];
g2.symbol.labelSignificantDigits = 3;
"use strict";
/**
 * g2.mec (c) 2013-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 * @typedef {g2}
 * @description Mechanical extensions. (Requires cartesian coordinates)
 * @returns {g2}
 */
var g2 = g2 || {
    prototype: {}
};
g2.prototype.skip = function skip(tag) {
    if (this.cmds.length)
        this.cmds[this.cmds.length - 1].skip = tag;
    return this
};
g2.prototype.dim = function dim({}) {
    return this.addCommand({
        c: "dim",
        a: arguments[0]
    })
};
g2.prototype.dim.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({
            lw: 1,
            w: 0,
            lc: "round",
            lj: "round",
            off: 0,
            over: 0,
            inside: true,
            fs: "#000"
        }, this);
        const dx = args.x2 - args.x1,
            dy = args.y2 - args.y1,
            len = Math.hypot(dx, dy);
        args.fixed = args.fixed || len / 2;
        const over = args.off > 0 ? Math.abs(args.over) : -Math.abs(args.over);
        const w = Math.atan2(dy, dx);
        return g2().beg({
            x: args.x1 - args.off * Math.sin(w),
            y: args.y1 + args.off * Math.cos(w),
            w: w
        }).vec({
            x1: args.inside ? 1 : -25,
            y1: 0,
            x2: 0,
            y2: 0,
            fixed: args.fixed,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw
        }).vec({
            x1: args.inside ? 0 : len + 25,
            y1: 0,
            x2: args.inside ? len : len,
            y2: 0,
            fixed: args.fixed,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw
        }).ins(g => {
            if (!args.inside) {
                g.lin({
                    x1: 0,
                    y1: 0,
                    x2: len,
                    y2: 0,
                    fs: args.fs,
                    ls: args.ls,
                    lw: args.lw
                })
            }
        }).end().ins(g => {
            if (!!args.off)
                g.lin({
                    x1: args.x1,
                    y1: args.y1,
                    x2: args.x1 - (over + args.off) * Math.sin(w),
                    y2: args.y1 + (over + args.off) * Math.cos(w),
                    lw: args.lw / 2,
                    lw: args.lw / 2,
                    ls: args.ls,
                    fs: args.fs
                }).lin({
                    x1: args.x1 + Math.cos(w) * len,
                    y1: args.y1 + Math.sin(w) * len,
                    x2: args.x1 + Math.cos(w) * len - (over + args.off) * Math.sin(w),
                    y2: args.y1 + Math.sin(w) * len + (over + args.off) * Math.cos(w),
                    lw: args.lw / 2,
                    ls: args.ls,
                    fs: args.fs
                })
        })
    }
});
g2.prototype.adim = function adim({}) {
    return this.addCommand({
        c: "adim",
        a: arguments[0]
    })
};
g2.prototype.adim.prototype = g2.mixin({}, g2.prototype.arc.prototype, {
    g2() {
        const args = Object.assign({
            lw: 1,
            w: 0,
            lc: "round",
            lj: "round",
            inside: true,
            fs: "#000"
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            w: args.w
        }).arc({
            x: 0,
            y: 0,
            r: args.r,
            w: 0,
            dw: args.dw,
            ls: args.ls,
            lw: args.lw
        }).vec({
            x1: args.inside ? args.r - .15 : args.r - 3.708,
            y1: args.inside ? 1 : 24.723,
            x2: args.r,
            y2: 0,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw,
            fixed: 30
        }).lin({
            x1: args.r - 3.5,
            y1: 0,
            x2: args.r + 3.5,
            y2: 0,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw
        }).end().beg({
            x: args.x,
            y: args.y,
            w: args.w + args.dw
        }).vec({
            x1: args.inside ? args.r - .15 : args.r - 3.708,
            y1: args.inside ? -1 : -24.723,
            x2: args.r,
            y2: 0,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw,
            fixed: 30
        }).lin({
            x1: args.r - 3.5,
            y1: 0,
            x2: args.r + 3.5,
            y2: 0,
            fs: args.fs,
            ls: args.ls,
            lw: args.lw
        }).end()
    }
});
g2.prototype.vec = function vec({}) {
    return this.addCommand({
        c: "vec",
        a: arguments[0]
    })
};
g2.prototype.vec.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({
            ls: "#000",
            fs: "@ls",
            lc: "round",
            lj: "round",
            lw: 1,
            fixed: undefined
        }, this);
        const dx = args.x2 - args.x1,
            dy = args.y2 - args.y1,
            r = Math.hypot(dx, dy);
        let z = args.head || 2 + args.lw;
        const z2 = (args.fixed || r) / 10;
        z = z > z2 ? z2 : z;
        return g2().beg(Object.assign({}, args, {
            x: args.x1,
            y: args.y1,
            w: Math.atan2(dy, dx)
        })).p().m({
            x: 0,
            y: 0
        }).l({
            x: r,
            y: 0
        }).stroke({
            ls: args.ls
        }).p().m({
            x: r,
            y: 0
        }).l({
            x: r - 5 * z,
            y: z
        }).a({
            dw: -Math.PI / 3,
            x: r - 5 * z,
            y: -z
        }).z().drw({
            ls: args.ls,
            fs: args.fs
        }).end()
    }
});
g2.prototype.slider = function() {
    return this.addCommand({
        c: "slider",
        a: arguments[0]
    })
};
g2.prototype.slider.prototype = g2.mixin({}, g2.prototype.rec.prototype, {
    g2() {
        const args = Object.assign({
            b: 32,
            h: 16,
            fs: "@linkfill"
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            w: args.w,
            fs: args.fs
        }).rec({
            x: -args.b / 2,
            y: -args.h / 2,
            b: args.b,
            h: args.h
        }).end()
    }
});
g2.prototype.spring = function() {
    return this.addCommand({
        c: "spring",
        a: arguments[0]
    })
};
g2.prototype.spring.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({
            h: 16
        }, this);
        const len = Math.hypot(args.x2 - args.x1, args.y2 - args.y1);
        const xm = (args.x2 + args.x1) / 2;
        const ym = (args.y2 + args.y1) / 2;
        const h = args.h;
        const ux = (args.x2 - args.x1) / len;
        const uy = (args.y2 - args.y1) / len;
        return g2().p().m({
            x: args.x1,
            y: args.y1
        }).l({
            x: xm - ux * h / 2,
            y: ym - uy * h / 2
        }).l({
            x: xm + (-ux / 6 + uy / 2) * h,
            y: ym + (-uy / 6 - ux / 2) * h
        }).l({
            x: xm + (ux / 6 - uy / 2) * h,
            y: ym + (uy / 6 + ux / 2) * h
        }).l({
            x: xm + ux * h / 2,
            y: ym + uy * h / 2
        }).l({
            x: args.x2,
            y: args.y2
        }).stroke(Object.assign({}, {
            ls: "@nodcolor"
        }, this, {
            fs: "transparent",
            lc: "round",
            lj: "round"
        }))
    }
});
g2.prototype.damper = function() {
    return this.addCommand({
        c: "damper",
        a: arguments[0]
    })
};
g2.prototype.damper.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({
            h: 16
        }, this);
        const len = Math.hypot(args.x2 - args.x1, args.y2 - args.y1);
        const xm = (args.x2 + args.x1) / 2;
        const ym = (args.y2 + args.y1) / 2;
        const h = args.h;
        const ux = (args.x2 - args.x1) / len;
        const uy = (args.y2 - args.y1) / len;
        return g2().p().m({
            x: args.x1,
            y: args.y1
        }).l({
            x: xm - ux * h / 2,
            y: ym - uy * h / 2
        }).m({
            x: xm + (ux - uy) * h / 2,
            y: ym + (uy + ux) * h / 2
        }).l({
            x: xm + (-ux - uy) * h / 2,
            y: ym + (-uy + ux) * h / 2
        }).l({
            x: xm + (-ux + uy) * h / 2,
            y: ym + (-uy - ux) * h / 2
        }).l({
            x: xm + (ux + uy) * h / 2,
            y: ym + (uy - ux) * h / 2
        }).m({
            x: xm,
            y: ym
        }).l({
            x: args.x2,
            y: args.y2
        }).stroke(Object.assign({}, {
            ls: "@nodcolor"
        }, this, {
            fs: "transparent",
            lc: "round",
            lj: "round"
        }))
    }
});
g2.prototype.link = function() {
    return this.addCommand({
        c: "link",
        a: arguments[0]
    })
};
g2.prototype.link.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        const args = Object.assign({
            ls: "@linkcolor",
            fs: "transparent"
        }, this);
        return g2().ply(Object.assign({}, this, {
            closed: true,
            ls: args.ls,
            fs: args.fs,
            lw: 7,
            lc: "round",
            lj: "round"
        }))
    }
});
g2.prototype.link2 = function() {
    return this.addCommand({
        c: "link2",
        a: arguments[0]
    })
};
g2.prototype.link2.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        return g2().ply(Object.assign({
            closed: true,
            ls: "@nodcolor",
            fs: "transparent",
            lw: 7,
            lc: "round",
            lj: "round"
        }, this)).ply(Object.assign({
            closed: true,
            ls: "@nodfill2",
            fs: "transparent",
            lw: 4.5,
            lc: "round",
            lj: "round"
        }, this)).ply(Object.assign({
            closed: true,
            ls: "@nodfill",
            fs: "transparent",
            lw: 2,
            lc: "round",
            lj: "round"
        }, this))
    }
});
g2.prototype.beam = function() {
    return this.addCommand({
        c: "beam",
        a: arguments[0]
    })
};
g2.prototype.beam.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        return g2().ply(Object.assign({
            closed: false,
            ls: "@linkcolor",
            fs: "transparent",
            lw: 7,
            lc: "round",
            lj: "round"
        }, this))
    }
});
g2.prototype.beam2 = function() {
    return this.addCommand({
        c: "beam2",
        a: arguments[0]
    })
};
g2.prototype.beam2.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        return g2().ply(Object.assign({
            closed: false,
            ls: "@nodcolor",
            fs: "transparent",
            lw: 7,
            lc: "round",
            lj: "round"
        }, this)).ply(Object.assign({
            closed: false,
            ls: "@nodfill2",
            fs: "transparent",
            lw: 4.5,
            lc: "round",
            lj: "round"
        }, this)).ply(Object.assign({
            closed: false,
            ls: "@nodfill",
            fs: "transparent",
            lw: 2,
            lc: "round",
            lj: "round"
        }, this))
    }
});
g2.prototype.bar = function() {
    return this.addCommand({
        c: "bar",
        a: arguments[0]
    })
};
g2.prototype.bar.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        return g2().lin(Object.assign({
            ls: "@linkcolor",
            lw: 6,
            lc: "round"
        }, this))
    }
});
g2.prototype.bar2 = function() {
    return this.addCommand({
        c: "bar2",
        a: arguments[0]
    })
};
g2.prototype.bar2.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({}, this);
        return g2().lin({
            x1: args.x1,
            y1: args.y1,
            x2: args.x2,
            y2: args.y2,
            ls: "@nodcolor",
            lw: 7,
            lc: "round"
        }).lin({
            x1: args.x1,
            y1: args.y1,
            x2: args.x2,
            y2: args.y2,
            ls: "@nodfill2",
            lw: 4.5,
            lc: "round"
        }).lin({
            x1: args.x1,
            y1: args.y1,
            x2: args.x2,
            y2: args.y2,
            ls: "@nodfill",
            lw: 2,
            lc: "round"
        })
    }
});
g2.prototype.pulley = function() {
    return this.addCommand({
        c: "pulley",
        a: arguments[0]
    })
};
g2.prototype.pulley.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    g2() {
        const args = Object.assign({}, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            w: args.w
        }).cir({
            x: 0,
            y: 0,
            r: args.r,
            ls: "@nodcolor",
            fs: "#e6e6e6",
            lw: 1
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 5,
            ls: "@nodcolor",
            fs: "#e6e6e6",
            lw: 1
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 6,
            ls: "#8e8e8e",
            fs: "transparent",
            lw: 2
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 8,
            ls: "#aeaeae",
            fs: "transparent",
            lw: 2
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 10,
            ls: "#cecece",
            fs: "transparent",
            lw: 2
        }).end()
    }
});
g2.prototype.pulley2 = function() {
    return this.addCommand({
        c: "pulley2",
        a: arguments[0]
    })
};
g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    g2() {
        const args = Object.assign({}, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            w: args.w
        }).bar2({
            x1: 0,
            y1: -args.r + 4,
            x2: 0,
            y2: args.r - 4
        }).bar2({
            x1: -args.r + 4,
            y1: 0,
            x2: args.r - 4,
            y2: 0
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 2.5,
            ls: "#e6e6e6",
            fs: "transparent",
            lw: 5
        }).cir({
            x: 0,
            y: 0,
            r: args.r,
            ls: "@nodcolor",
            fs: "transparent",
            lw: 1
        }).cir({
            x: 0,
            y: 0,
            r: args.r - 5,
            ls: "@nodcolor",
            fs: "transparent",
            lw: 1
        }).end()
    }
});
g2.prototype.rope = function() {
    return this.addCommand({
        c: "rope",
        a: arguments[0]
    })
};
g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({
            w: 0
        }, this);
        let x1 = "p1" in args ? args.p1.x : "x1" in args ? args.x1 : "x" in args ? args.x : 0;
        let y1 = "p1" in args ? args.p1.y : "y1" in args ? args.y1 : "y" in args ? args.y : 0;
        let x2 = "p2" in args ? args.p2.x : "x2" in args ? args.x2 : "dx" in args ? x1 + args.dx : "r" in args ? x1 + args.r * Math.cos(args.w) : x1 + 10;
        let y2 = "p2" in args ? args.p2.y : "y2" in args ? args.y2 : "dy" in args ? y1 + args.dy : "r" in args ? y1 + args.r * Math.sin(args.w) : y1;
        let Rmin = 10;
        let R1 = args.r1 > Rmin ? args.r1 - 2.5 : args.r1 < -Rmin ? args.r1 + 2.5 : 0;
        let R2 = args.r2 > Rmin ? args.r2 - 2.5 : args.r2 < Rmin ? args.r2 + 2.5 : 0;
        let dx = x2 - x1,
            dy = y2 - y1,
            dd = dx ** 2 + dy ** 2;
        let R12 = R1 + R2,
            l = Math.sqrt(dd - R12 ** 2);
        let cpsi = (R12 * dx + l * dy) / dd;
        let spsi = (R12 * dy - l * dx) / dd;
        x1 = x1 + cpsi * R1, y1 = y1 + spsi * R1, x2 = x2 - cpsi * R2, y2 = y2 - spsi * R2;
        return g2().lin({
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2,
            ls: "#888",
            lw: 4
        })
    }
});
g2.prototype.ground = function() {
    return this.addCommand({
        c: "ground",
        a: arguments[0]
    })
};
g2.prototype.ground.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        const args = Object.assign({
            h: 4
        }, this);
        const itr = g2.pntItrOf(args.pts);
        let pn,
            en,
            lam,
            i;
        let pp = itr(i = 0);
        let p0 = pp;
        let h = args.h;
        let p = itr(++i);
        let dx = p.x - pp.x;
        let dy = p.y - pp.y;
        let len = Math.hypot(dx, dy) || 1;
        let ep = {
            x: dx / len,
            y: dy / len
        };
        let e0 = ep;
        let eq = [p0];
        let sign = args.pos === "left" ? 1 : -1;
        for (pn = itr(++i); i < itr.len; pn = itr(++i)) {
            dx = pn.x - p.x;
            dy = pn.y - p.y;
            len = Math.hypot(dx, dy) || 1;
            len = Math.hypot(dx, dy) || 1;
            en = {
                x: dx / len,
                y: dy / len
            };
            lam = (1 - en.x * ep.x - en.y * ep.y) / (ep.y * en.x - ep.x * en.y);
            eq.push({
                x: p.x + sign * (h + 1) * (lam * ep.x - ep.y),
                y: p.y + sign * (h + 1) * (lam * ep.y + ep.x)
            });
            ep = en;
            pp = p;
            p = pn
        }
        if (args.closed) {
            dx = p0.x - p.x;
            dy = p0.y - p.y;
            len = Math.hypot(dx, dy) || 1;
            en = {
                x: dx / len,
                y: dy / len
            };
            lam = (1 - en.x * ep.x - en.y * ep.y) / (ep.y * en.x - ep.x * en.y);
            eq.push({
                x: p.x + sign * (h + 1) * (lam * ep.x - ep.y),
                y: p.y + sign * (h + 1) * (lam * ep.y + ep.x)
            });
            lam = (1 - e0.x * en.x - e0.y * en.y) / (en.y * e0.x - en.x * e0.y);
            eq[0] = {
                x: p0.x + sign * (h + 1) * (-lam * e0.x - e0.y),
                y: p0.y + sign * (h + 1) * (-lam * e0.y + e0.x)
            }
        } else {
            eq[0] = {
                x: p0.x - sign * (h + 1) * e0.y,
                y: p0.y + sign * (h + 1) * e0.x
            };
            eq.push({
                x: p.x - sign * (h + 1) * ep.y,
                y: p.y + sign * (h + 1) * ep.x
            })
        }
        return g2().beg({
            x: -.5,
            y: -.5,
            ls: "@linkcolor",
            lw: 2,
            fs: "transparent",
            lc: "butt",
            lj: "miter"
        }).ply(Object.assign({}, args, {
            pts: eq,
            ls: "@nodfill2",
            lw: 2 * h
        })).ply(Object.assign({}, args)).end()
    }
});
g2.prototype.load = function() {
    return this.addCommand({
        c: "load",
        a: arguments[0]
    })
};
g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype, {
    g2() {
        const args = Object.assign({
            pointAt: this.pointAt,
            spacing: 20,
            w: -Math.PI / 2
        }, this);
        const pitr = g2.pntItrOf(args.pts),
            startLoc = [],
            arr = [];
        let arrLen = 0;
        for (let itr = 0; itr < pitr.len; itr++) {
            arr.push(pitr(itr))
        }
        if (arr[arr.length - 1] !== arr[0]) {
            arr.push(arr[0])
        }
        for (let itr = 1; itr < arr.length; itr++) {
            arrLen += Math.hypot(arr[itr].y - arr[itr - 1].y, arr[itr].x - arr[itr - 1].x)
        }
        for (let itr = 0; itr * args.spacing < arrLen; itr++) {
            startLoc.push(itr * args.spacing / arrLen)
        }
        args.pts = arr;
        function isPntInPly({x: x, y: y}) {
            let match = 0;
            for (let n = arr.length, i = 0, pi = arr[i], pj = arr[n - 1]; i < n; pj = pi, pi = arr[++i]) {
                if ((y >= pi.y || y >= pj.y) && (y <= pi.y || y <= pj.y) && (x <= pi.x || x <= pj.x) && pi.y !== pj.y && (pi.x === pj.x || x <= pj.x + (y - pj.y) * (pi.x - pj.x) / (pi.y - pj.y))) {
                    match++
                }
            }
            return match % 2 != 0
        }
        return g2().ply({
            pts: args.pts,
            closed: true,
            ls: "transparent",
            fs: "@linkfill"
        }).ins(g => {
            for (const pts of startLoc) {
                let dist = 10 * args.lw || 10;
                const {x: x, y: y} = args.pointAt(pts),
                    t = {
                        x: x + Math.cos(args.w) * dist,
                        y: y + Math.sin(args.w) * dist
                    };
                if (isPntInPly(t, {
                    pts: arr
                })) {
                    while (isPntInPly(t, {
                        pts: arr
                    })) {
                        dist++;
                        t.x = x + Math.cos(args.w) * dist, t.y = y + Math.sin(args.w) * dist
                    }
                    g.vec({
                        x1: x,
                        y1: y,
                        x2: t.x,
                        y2: t.y,
                        ls: args.ls || "darkred",
                        lw: args.lw || 1
                    })
                }
            }
        })
    }
});
g2.prototype.pol = function() {
    return this.addCommand({
        c: "pol",
        a: arguments[0] || {}
    })
};
g2.prototype.pol.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).cir({
            r: 6,
            fs: "@nodfill"
        }).cir({
            r: 2.5,
            fs: "@ls",
            ls: "transparent"
        }).end()
    }
});
g2.prototype.gnd = function() {
    return this.addCommand({
        c: "gnd",
        a: arguments[0] || {}
    })
};
g2.prototype.gnd.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).cir({
            x: 0,
            y: 0,
            r: 6,
            ls: "@nodcolor",
            fs: "@nodfill",
            lwnosc: true
        }).p().m({
            x: 0,
            y: 6
        }).a({
            dw: Math.PI / 2,
            x: -6,
            y: 0
        }).l({
            x: 6,
            y: 0
        }).a({
            dw: -Math.PI / 2,
            x: 0,
            y: -6
        }).z().fill({
            fs: "@nodcolor"
        }).end()
    }
});
g2.prototype.nod = function() {
    return this.addCommand({
        c: "nod",
        a: arguments[0] || {}
    })
};
g2.prototype.nod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).cir({
            r: 4,
            ls: "@nodcolor",
            fs: "@nodfill",
            lwnosc: true
        }).end()
    }
});
g2.prototype.dblnod = function() {
    return this.addCommand({
        c: "dblnod",
        a: arguments[0] || {}
    })
};
g2.prototype.dblnod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).cir({
            r: 6,
            ls: "@nodcolor",
            fs: "@nodfill"
        }).cir({
            r: 3,
            ls: "@nodcolor",
            fs: "@nodfill2",
            lwnosc: true
        }).end()
    }
});
g2.prototype.nodfix = function() {
    return this.addCommand({
        c: "nodfix",
        a: arguments[0] || {}
    })
};
g2.prototype.nodfix.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).p().m({
            x: -8,
            y: -12
        }).l({
            x: 0,
            y: 0
        }).l({
            x: 8,
            y: -12
        }).drw({
            ls: "@nodcolor",
            fs: "@nodfill2"
        }).cir({
            x: 0,
            y: 0,
            r: 4,
            ls: "@nodcolor",
            fs: "@nodfill"
        }).end()
    }
});
g2.prototype.nodflt = function() {
    return this.addCommand({
        c: "nodflt",
        a: arguments[0] || {}
    })
};
g2.prototype.nodflt.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w
        }).p().m({
            x: -8,
            y: -12
        }).l({
            x: 0,
            y: 0
        }).l({
            x: 8,
            y: -12
        }).drw({
            ls: "@nodcolor",
            fs: "@nodfill2"
        }).cir({
            x: 0,
            y: 0,
            r: 4,
            ls: "@nodcolor",
            fs: "@nodfill"
        }).lin({
            x1: -9,
            y1: -19,
            x2: 9,
            y2: -19,
            ls: "@nodfill2",
            lw: 5,
            lwnosc: false
        }).lin({
            x1: -9,
            y1: -15.5,
            x2: 9,
            y2: -15.5,
            ls: "@nodcolor",
            lw: 2,
            lwnosc: false
        }).end()
    }
});
g2.prototype.origin = function() {
    return this.addCommand({
        c: "origin",
        a: arguments[0] || {}
    })
};
g2.prototype.origin.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({
            x: 0,
            y: 0,
            scl: 1,
            w: 0,
            z: 3.5
        }, this);
        return g2().beg({
            x: args.x,
            y: args.y,
            scl: args.scl,
            w: args.w,
            lc: "round",
            lj: "round",
            fs: "#ccc"
        }).vec({
            x1: 0,
            y1: 0,
            x2: 10 * args.z,
            y2: 0,
            lw: .8,
            fs: "#ccc"
        }).vec({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 10 * args.z,
            lw: .8,
            fs: "#ccc"
        }).cir({
            x: 0,
            y: 0,
            r: 2.5,
            fs: "#ccc"
        }).end()
    }
});
g2.State = g2.State || {};
g2.State.nodcolor = "#333";
g2.State.nodfill = "#dedede";
g2.State.nodfill2 = "#aeaeae";
g2.State.linkcolor = "#666";
g2.State.linkfill = "rgba(225,225,225,0.75)";
g2.State.dimcolor = "darkslategray";
g2.State.solid = [];
g2.State.dash = [15, 10];
g2.State.dot = [4, 4];
g2.State.dashdot = [25, 6.5, 2, 6.5];
g2.State.labelOffset = 5;
g2.State.labelSignificantDigits = 3;
"use strict";
/**
 * g2.chart (c) 2015-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 * @typedef g2
 * @returns {object} chart
 * @param {object} args - Chart arguments object or
 * @property {float} x - x-position of lower left corner of chart rectangle.
 * @property {float} y - y-position of lower left corner of chart rectangle.
 * @property {float} [b=150] - width of chart rectangle.
 * @property {float} [h=100] - height of chart rectangle.
 * @property {string} [ls] - border color.
 * @property {string} [fs] - fill color.
 * @property {(string|object)} [title] - chart title.
 * @property {string} [title.text] - chart title text string.
 * @property {float} [title.offset=0] - chart title vertical offset.
 * @property {object} [title.style] - chart title style.
 * @property {string} [title.style.font=14px serif] - chart title font.
 * @property {string} [title.style.thal=center] - chart title horizontal align.
 * @property {string} [title.style.tval=bottom] - chart title vertical align.
 * @property {array} [funcs=[]] - array of dataset `data` and/or function `fn` objects.
 * @property {object} [funcs[item]] - dataset or function object.
 * @property {array} [funcs[item].data] - data points as flat array `[x,y,..]`, array of point arrays `[[x,y],..]` or array of point objects `[{x,y},..]`.
 * @property {function} [funcs[item].fn] - function `y = f(x)` recieving x-value returning y-value.
 * @property {float} [funcs[item].dx] - x increment to apply to function `fn`. Ignored with data points.
 * @property {boolean} [funcs[item].fill] - fill region between function graph and x-origin line.
 * @property {boolean} [funcs[item].dots] - place circular dots at data points (Avoid with `fn`s).
 * @property {boolean|object} [xaxis=false] - x-axis.
 * @property {boolean|object} [xaxis.grid=false] - x-axis grid lines.
 * @property {string} [xaxis.grid.ls] - x-axis grid line style (color).
 * @property {string} [xaxis.grid.lw] - x-axis grid line width.
 * @property {string} [xaxis.grid.ld] - x-axis grid line dash style.
 * @property {boolean} [xaxis.line=true] - display x-axis base line.
 * @property {boolean} [xaxis.origin=false] - display x-axis origin line.
 * @property {boolean|object} [yaxis=false] - y-axis.
 * @property {boolean|object} [yaxis.grid=false] - y-axis grid lines.
 * @property {string} [yaxis.grid.ls] - y-axis grid line style color.
 * @property {string} [yaxis.grid.lw] - y-axis grid line width.
 * @property {string} [yaxis.grid.ld] - y-axis grid line dash style.
 * @property {boolean} [yaxis.line=true] - display y-axis base line.
 * @property {boolean} [yaxis.origin=false] - display y-axis origin line.
 * @property {float} [xmin] - minimal x-axis value. If not given it is calculated from chart data values.
 * @property {float} [xmax] - maximal x-axis value. If not given it is calculated from chart data values.
 * @property {float} [ymin] - minimal y-axis value. If not given it is calculated from chart data values.
 * @property {float} [ymax] - maximal y-axis value. If not given it is calculated from chart data values.
 */
g2.prototype.chart = function chart({x: x, y: y, b: b, h: h, style: style, title: title, funcs: funcs, xaxis: xaxis, xmin: xmin, xmax: xmax, yaxis: yaxis, ymin: ymin, ymax: ymax}) {
    return this.addCommand({
        c: "chart",
        a: arguments[0]
    })
};
g2.prototype.chart.prototype = {
    g2() {
        const g = g2(),
            funcs = this.get("funcs"),
            title = this.title && this.get("title");
        if (!this.b)
            this.b = this.defaults.b;
        if (!this.h)
            this.h = this.defaults.h;
        if (funcs && funcs.length) {
            const tmp = [this.xmin === undefined, this.xmax === undefined, this.ymin === undefined, this.ymax === undefined];
            funcs.forEach(f => this.initFunc(f, ...tmp))
        }
        this.xAxis = this.autoAxis(this.get("xmin"), this.get("xmax"), 0, this.b);
        this.yAxis = this.autoAxis(this.get("ymin"), this.get("ymax"), 0, this.h);
        g.rec({
            x: this.x,
            y: this.y,
            b: this.b,
            h: this.h,
            fs: this.get("fs"),
            ls: this.get("ls")
        });
        g.beg(Object.assign({
            x: this.x,
            y: this.y,
            lw: 1
        }, this.defaults.style, this.style));
        if (title)
            g.txt(Object.assign({
                str: this.title && this.title.text || this.title,
                x: this.get("b") / 2,
                y: this.get("h") + this.get("title", "offset"),
                w: 0
            }, this.defaults.title.style, this.title && this.title.style || {}));
        if (this.xaxis)
            this.drawXAxis(g);
        if (this.yaxis)
            this.drawYAxis(g);
        g.end();
        if (funcs)
            funcs.forEach((fnc, i) => {this.drawFunc(g, fnc, this.defaults.colors[i % this.defaults.colors.length])});
        return g
    },
    initFunc(fn, setXmin, setXmax, setYmin, setYmax) {
        let itr;
        if (fn.data && fn.data.length) {
            itr = fn.itr = g2.pntItrOf(fn.data)
        } else if (fn.fn && fn.dx) {
            const xmin = +this.xmin || this.defaults.xmin;
            const xmax = +this.xmax || this.defaults.xmax;
            itr = fn.itr = (i => {
                let x = xmin + i * fn.dx;
                return {
                    x: x,
                    y: fn.fn(x)
                }
            });
            itr.len = (xmax - xmin) / fn.dx + 1
        }
        if (itr && (setXmin || setXmax || setYmin || setYmax)) {
            const xarr = [];
            const yarr = [];
            for (let i = 0; i < itr.len; ++i) {
                xarr.push(itr(i).x);
                yarr.push(itr(i).y)
            }
            if (setXmin) {
                const xmin = Math.min(...xarr);
                if (!this.xmin || xmin < this.xmin)
                    this.xmin = xmin
            }
            if (setXmax) {
                const xmax = Math.max(...xarr);
                if (!this.xmax || xmax > this.xmax)
                    this.xmax = xmax
            }
            if (setYmin) {
                const ymin = Math.min(...yarr);
                if (!this.ymin || ymin < this.ymin)
                    this.ymin = ymin
            }
            if (setYmax) {
                const ymax = Math.max(...yarr);
                if (!this.ymax || ymax > this.ymax)
                    this.ymax = ymax
            }
            if (fn.color && typeof fn.color === "number")
                fn.color = this.defaults.colors[fn.color % this.defaults.colors.length]
        }
    },
    autoAxis(zmin, zmax, tmin, tmax) {
        let base = 2,
            exp = 1,
            eps = Math.sqrt(Number.EPSILON),
            Dz = zmax - zmin || 1,
            Dt = tmax - tmin || 1,
            scl = Dz > eps ? Dt / Dz : 1,
            dz = base * Math.pow(10, exp),
            dt = Math.floor(scl * dz),
            N,
            dt01,
            i0,
            j0,
            jth,
            t0,
            res;
        while (dt < 14 || dt > 35) {
            if (dt < 14) {
                if (base == 1)
                    base = 2;
                else if (base == 2)
                    base = 5;
                else if (base == 5) {
                    base = 1;
                    exp++
                }
            } else {
                if (base == 1) {
                    base = 5;
                    exp--
                } else if (base == 2)
                    base = 1;
                else if (base == 5)
                    base = 2
            }
            dz = base * Math.pow(10, exp);
            dt = scl * dz
        }
        i0 = (scl * Math.abs(zmin) + eps / 2) % dt < eps ? Math.floor(zmin / dz) : Math.floor(zmin / dz) + 1;
        let z0 = i0 * dz;
        t0 = Math.round(scl * (z0 - zmin));
        N = Math.floor((Dt - t0) / dt) + 1;
        j0 = base % 2 && i0 % 2 ? i0 + 1 : i0;
        jth = exp === 0 && N < 11 ? 1 : base === 2 && N > 9 ? 5 : 2;
        return {
            zmin: zmin,
            zmax: zmax,
            base: base,
            exp: exp,
            scl: scl,
            dt: dt,
            dz: dz,
            N: N,
            t0: t0,
            z0: z0,
            i0: i0,
            j0: j0,
            jth: jth,
            itr(i) {
                return {
                    t: this.t0 + i * this.dt,
                    z: parseFloat((this.z0 + i * this.dz).toFixed(Math.abs(this.exp))),
                    maj: (this.j0 - this.i0 + i) % this.jth === 0
                }
            }
        }
    },
    drawXAxis(g) {
        let tick,
            showgrid = this.xaxis && this.xaxis.grid,
            gridstyle = showgrid && Object.assign({}, this.defaults.xaxis.grid, this.xaxis.grid),
            showaxis = this.xaxis || this.xAxis,
            axisstyle = showaxis && Object.assign({}, this.defaults.xaxis.style, this.defaults.xaxis.labels.style, this.xaxis && this.xaxis.style || {}),
            showline = showaxis && this.get("xaxis", "line"),
            showlabels = this.xAxis && showaxis && this.get("xaxis", "labels"),
            showticks = this.xAxis && showaxis && this.get("xaxis", "ticks"),
            ticklen = showticks ? this.get("xaxis", "ticks", "len") : 0,
            showorigin = showaxis && this.get("xaxis", "origin"),
            title = this.xaxis && (this.get("xaxis", "title", "text") || this.xaxis.title) || "";
        g.beg(axisstyle);
        for (let i = 0; i < this.xAxis.N; i++) {
            tick = this.xAxis.itr(i);
            if (showgrid)
                g.lin(Object.assign({
                    x1: tick.t,
                    y1: 0,
                    x2: tick.t,
                    y2: this.h
                }, gridstyle));
            if (showticks)
                g.lin({
                    x1: tick.t,
                    y1: tick.maj ? ticklen : 2 / 3 * ticklen,
                    x2: tick.t,
                    y2: tick.maj ? -ticklen : -2 / 3 * ticklen
                });
            if (showlabels && tick.maj)
                g.txt(Object.assign({
                    str: parseFloat(tick.z),
                    x: tick.t,
                    y: -(this.get("xaxis", "ticks", "len") + this.get("xaxis", "labels", "offset")),
                    w: 0
                }, this.get("xaxis", "labels", "style") || {}))
        }
        if (showline)
            g.lin({
                y1: 0,
                y2: 0,
                x1: 0,
                x2: this.b
            });
        if (showorigin && this.xmin <= 0 && this.xmax >= 0)
            g.lin({
                x1: -this.xAxis.zmin * this.xAxis.scl,
                y1: 0,
                x2: -this.xAxis.zmin * this.xAxis.scl,
                y2: this.h
            });
        if (title)
            g.txt(Object.assign({
                str: title.text || title,
                x: this.b / 2,
                y: -(this.get("xaxis", "title", "offset") + (showticks && this.get("xaxis", "ticks", "len") || 0) + (showlabels && this.get("xaxis", "labels", "offset") || 0) + (showlabels && parseFloat(this.get("xaxis", "labels", "style", "font")) || 0)),
                w: 0
            }, this.get("xaxis", "title", "style")));
        g.end()
    },
    drawYAxis(g) {
        let tick,
            showgrid = this.yaxis && this.yaxis.grid,
            gridstyle = showgrid && Object.assign({}, this.defaults.yaxis.grid, this.yaxis.grid),
            showaxis = this.yaxis || this.yAxis,
            axisstyle = showaxis && Object.assign({}, this.defaults.yaxis.style, this.defaults.yaxis.labels.style, this.yaxis && this.yaxis.style || {}),
            showline = showaxis && this.get("yaxis", "line"),
            showlabels = this.yAxis && showaxis && this.get("yaxis", "labels"),
            showticks = this.yAxis && showaxis && this.get("yaxis", "ticks"),
            ticklen = showticks ? this.get("yaxis", "ticks", "len") : 0,
            showorigin = showaxis && this.get("yaxis", "origin"),
            title = this.yaxis && (this.get("yaxis", "title", "text") || this.yaxis.title) || "";
        g.beg(axisstyle);
        for (let i = 0; i < this.yAxis.N; i++) {
            tick = this.yAxis.itr(i);
            if (i && showgrid)
                g.lin(Object.assign({
                    y1: tick.t,
                    x2: this.b,
                    x1: 0,
                    y2: tick.t
                }, gridstyle));
            if (showticks)
                g.lin({
                    y1: tick.t,
                    x2: tick.maj ? -ticklen : -2 / 3 * ticklen,
                    y2: tick.t,
                    y2: tick.t,
                    x1: tick.maj ? ticklen : 2 / 3 * ticklen
                });
            if (showlabels && tick.maj)
                g.txt(Object.assign({
                    str: parseFloat(tick.z),
                    x: -(this.get("yaxis", "ticks", "len") + this.get("yaxis", "labels", "offset")),
                    y: tick.t,
                    w: Math.PI / 2
                }, this.get("yaxis", "labels", "style")))
        }
        if (showline)
            g.lin({
                y1: 0,
                x1: 0,
                x2: 0,
                y2: this.h
            });
        if (showorigin && this.ymin <= 0 && this.ymax >= 0)
            g.lin({
                x1: 0,
                y1: -this.yAxis.zmin * this.yAxis.scl,
                x2: this.b,
                y2: -this.yAxis.zmin * this.yAxis.scl
            });
        if (title)
            g.txt(Object.assign({
                str: title.text || title,
                x: -(this.get("yaxis", "title", "offset") + (showticks && this.get("yaxis", "ticks", "len") || 0) + (showlabels && this.get("yaxis", "labels", "offset") || 0) + (showlabels && parseFloat(this.get("yaxis", "labels", "style", "font")) || 0)),
                y: this.h / 2,
                w: Math.PI / 2
            }, this.get("yaxis", "title", "style")));
        g.end()
    },
    drawFunc(g, fn, defaultcolor) {
        let itr = fn.itr;
        if (itr) {
            let fill = fn.fill || fn.style && fn.style.fs && fn.style.fs !== "transparent",
                color = fn.color = fn.color || fn.style && fn.style.ls || defaultcolor,
                plydata = [],
                args = Object.assign({
                    pts: plydata,
                    closed: false,
                    ls: color,
                    fs: fill ? g2.color.rgbaStr(color, .125) : "transparent",
                    lw: 1
                }, fn.style);
            if (fill)
                plydata.push(this.pntOf({
                    x: itr(0).x,
                    y: 0
                }));
            for (let i = 0, n = itr.len; i < n; i++)
                plydata.push(this.pntOf(itr(i)));
            if (fill)
                plydata.push(this.pntOf({
                    x: itr(itr.len - 1).x,
                    y: 0
                }));
            if (fn.spline && g.spline)
                g.spline(args);
            else
                g.ply(args);
            if (fn.dots) {
                g.beg({
                    fs: "snow"
                });
                for (var i = 0; i < plydata.length; i++)
                    g.cir(Object.assign({}, plydata[i], {
                        r: 2,
                        lw: 1
                    }));
                g.end()
            }
        }
    },
    pntOf: function(xy) {
        return {
            x: this.x + Math.max(Math.min((xy.x - this.xAxis.zmin) * this.xAxis.scl, this.b), 0),
            y: this.y + Math.max(Math.min((xy.y - this.yAxis.zmin) * this.yAxis.scl, this.h), 0)
        }
    },
    get(n1, n2, n3, n4) {
        const loc = n4 ? this[n1] && this[n1][n2] && this[n1][n2][n3] && this[n1][n2][n3][n4] : n3 ? this[n1] && this[n1][n2] && this[n1][n2][n3] : n2 ? this[n1] && this[n1][n2] : n1 ? this[n1] : undefined,
            dflts = this.defaults;
        return loc !== undefined ? loc : n4 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3] && dflts[n1][n2][n3][n4] : n3 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3] : n2 ? dflts[n1] && dflts[n1][n2] : n1 ? dflts[n1] : undefined
    },
    defaults: {
        x: 0,
        y: 0,
        xmin: 0,
        xmax: 1,
        ymin: 0,
        ymax: 1,
        b: 150,
        h: 100,
        ls: "transparent",
        fs: "#efefef",
        color: false,
        colors: ["#426F42", "#8B2500", "#23238E", "#5D478B"],
        title: {
            text: "",
            offset: 3,
            style: {
                font: "16px serif",
                fs: "black",
                thal: "center",
                tval: "bottom"
            }
        },
        funcs: [],
        xaxis: {
            fill: false,
            line: true,
            style: {
                ls: "#888",
                thal: "center",
                tval: "top",
                fs: "black"
            },
            origin: false,
            title: {
                text: null,
                offset: 1,
                style: {
                    font: "12px serif",
                    fs: "black"
                }
            },
            ticks: {
                len: 6
            },
            grid: {
                ls: "#ddd",
                ld: []
            },
            labels: {
                loc: "auto",
                offset: 1,
                style: {
                    font: "11px serif",
                    fs: "black"
                }
            }
        },
        yaxis: {
            line: true,
            style: {
                ls: "#888",
                thal: "center",
                tval: "bottom",
                fs: "black"
            },
            origin: false,
            title: {
                text: null,
                offset: 2,
                style: {
                    font: "12px serif",
                    fs: "black"
                }
            },
            ticks: {
                len: 6
            },
            grid: {
                ls: "#ddd",
                ld: []
            },
            labels: {
                loc: "auto",
                offset: 1,
                style: {
                    font: "11px serif",
                    fs: "black"
                }
            }
        }
    }
};
g2.color = {
    rgba(color, alpha) {
        let res;
        alpha = alpha !== undefined ? alpha : 1;
        if (color === "transparent")
            return {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            };
        if (color in g2.color.names)
            color = "#" + g2.color.names[color];
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return {
                r: parseInt(res[1], 16),
                g: parseInt(res[2], 16),
                b: parseInt(res[3], 16),
                a: alpha
            };
        if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return {
                r: parseInt(res[1] + res[1], 16),
                g: parseInt(res[2] + res[2], 16),
                b: parseInt(res[3] + res[3], 16),
                a: alpha
            };
        if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return {
                r: parseInt(res[1]),
                g: parseInt(res[2]),
                b: parseInt(res[3]),
                a: alpha
            };
        if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(color))
            return {
                r: parseInt(res[1]),
                g: parseInt(res[2]),
                b: parseInt(res[3]),
                a: alpha !== undefined ? alpha : parseFloat(res[4])
            };
        if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return {
                r: parseFloat(res[1]) * 2.55,
                g: parseFloat(res[2]) * 2.55,
                b: parseFloat(result[3]) * 2.55,
                a: alpha
            }
    },
    rgbaStr(color, alpha) {
        const c = g2.color.rgba(color, alpha);
        return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")"
    },
    names: {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        violetred: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32"
    }
};

