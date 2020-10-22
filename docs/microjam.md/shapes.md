---
"layout": "page",
"title": "mec2-shapes",
"header": "Shapes",
"date": "2020-06-09",
"uses": [ { "uri": "navigation.md" } ],
"description": "",
"permalink": "#",
"tags": []
---

### Shapes

It is possible to stylize elements with geometric forms or images.
Those `shapes` are only cosmetic and serve no functional purpose.

All `shapes` need a `p` or similar references node `id`s.


Predefined types for geometries are:
- `fix`: Marks a `node` as stationary. `w0` determines an angle. Default: 0.
- `flt`: Same as `fix`, but marks `node` as being movable translational.
- `slider`: Same as `flt`, but represents a movable slider.
- `bar`: Connect `node` `p1` and `node` `p2` using a bar.
- `beam`: Same as `bar`, but using only one `p`. Reference an angle of a constraint with `wref` and define the length of the beam with `len`.
- `wheel`: Draw a `wheel` on a `node`. `wref` a constraint for the angle.
- `poly`: Same as `beam`, but instead of a `beam`, a polygon is drawn using a `pts` array of coordinates.
- `img`: Import an image using [g2's image function](https://github.com/goessner/g2/wiki/Elements#images).

### Examples

<mec-2 width="701" height="301" grid cartesian x0="100" y0="25">
        {
            "nodes": [
                { "id": "A0", "x": 75, "y": 125, "base": true },
                { "id": "A", "x": 100, "y": 175 },
                { "id": "B0", "x": 300, "y": 125 }
            ],
            "constraints": [
                {
                  "id": "a", "p1": "A0", "p2": "A",
                  "len": { "type": "const" },
                  "ori": { "type": "drive", "repeat": 3 }
                }, {
                  "id": "b", "p1": "B0", "p2": "A",
                  "len": { "type": "const" }
                }, {
                  "id": "c", "p1": "A0", "p2": "B0",
                  "ori": { "type": "const" }
                }
            ],
            "shapes": [
                { "type": "fix", "p": "A0" },
                { "type": "flt", "p": "B0" },
                {"type": "bar", "p1": "B0", "p2": "A"},
                {"type": "bar", "p1": "A0", "p2": "A"}
            ]
        }
    </mec-2>

```json
<mec-2 width="701" height="301" grid cartesian x0="100" y0="25">
        {
            "nodes": [
                { "id": "A0", "x": 75, "y": 125, "base": true },
                { "id": "A", "x": 100, "y": 175 },
                { "id": "B0", "x": 300, "y": 125 }
            ],
            "constraints": [
                {
                  "id": "a", "p1": "A0", "p2": "A",
                  "len": { "type": "const" },
                  "ori": { "type": "drive", "repeat": 3 }
                }, {
                  "id": "b", "p1": "B0", "p2": "A",
                  "len": { "type": "const" }
                }, {
                  "id": "c", "p1": "A0", "p2": "B0",
                  "ori": { "type": "const" }
                }
            ],
            "shapes": [
                { "type": "fix", "p": "A0" },
                { "type": "flt", "p": "B0" },
                {"type": "bar", "p1": "B0", "p2": "A"},
                {"type": "bar", "p1": "A0", "p2": "A"}
            ]
        }
    </mec-2>
```
<mec-2 width="400" height="600" x0="0" y0="0" grid cartesian nodelabels>
{
    "nodes": [
        { "id":"A0","x":204.8,"y":223.2,"base":true },
        { "id":"A","x":242.8,"y":289.6 },
        { "id":"B","x":226,"y":530 },
        { "id":"B0","x":380.2,"y":477.2,"base":true }
    ],
    "constraints": [
        { "id":"a","p1":"A0","p2":"A","len":{ "type":"const" },"ori":{ "type":"drive","func":"linear","Dt":5,"Dw":-6.2832,"repeat":5 } },
        { "id":"b","p1":"A","p2":"B","len":{ "type":"const" } },
        { "id":"c","p1":"B0","p2":"B","len":{ "type":"const" } }
    ],
    "shapes": [
        { "type":"img","uri":"./img/cranks.png","p":"A0","xoff":220,"yoff":-50,"w0":-1.5708,"wref":"a","scl":0.4 },
        { "type":"img","uri":"./img/hebel.png","p":"B","xoff":200,"yoff":-100,"w0":-1.5708,"wref":"a","scl":0.2 }
    ]
}
</mec-2>

