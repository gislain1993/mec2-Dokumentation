---
"layout": "page",
"title": "mec2-Cheatsheet",
"header": "Cheatsheet",
"date": "2020-06-09",
"uses": [ { "uri": "navigation.md" } ],
"description": "",
"permalink": "#",
"tags": []
---
### Abstract

## **Prerequisite**

Use the code shown in the first code listing to implement mec-2 custom html element with attributes you desire to table 1.

<aside style="min-width:10%">

```HTML
<mec-2 width="400" height="300" x0="0" y0="0" grid cartesian nodelabels>
{

}
</mec-2>
```
##### Listing 1: Custom HTML-tag for mec-2
</aside>

#### Table 1: Attributes of the mec-2 element

| Attribute | Type | Impact |
|---|---|---|
| width | string | width of the element in px |
| height | string | height of the element in px |
| x0 | string | x-origin of the model |
| y0 | string | y-origin of the model | 
| grid | boolean | show grid in background |
| cartesian | boolean | whether cartesian is true or not |
| darkmode | boolean | whether dark mode is set or not |
| gravity | boolean | activate gravity |
| pausing | boolean | pause the model |
| hidenodes | boolean | hide nodes |
| constraintlabels | boolean | show labels of constraints |
| loadlabels | boolean | show labels of loads |
| nodelabels | boolean | show labels of nodes |

## **[*Nodes*](https://goessner.github.io/mec2/microjam.md/getting_started.html#nodes)**

<aside style="min-width: 10%">

```HTML
<mec-2 width="240" height="250" x0="70" y0="70" grid cartesian nodelabels>
{
"nodes": [
    { "id":"A", "x":0, "y":0, "base":true },
    { "id":"B", "x":100, "y":100, "idloc":"e" }
]
}
</mec-2>
```
##### example 1: Implementation of nodes

<mec-2 width="300" height="70" x0="70" y0="-40" grid cartesian nodelabels>
{
"nodes": [
    { "id":"A", "x":0, "y":60, "base":true },
    { "id":"B", "x":150, "y":90, "idloc":"e" }
  ]
}
</mec-2>

##### fig 1: Result of example 1

</aside>

Create a node by giving the required properties. Don't forget to put the propertie key into quotation marks.

| Required properties | Type of value | Comment |
|---|---|---|
| id | string | the name of the node |
| x | number | x-coordinate |
| y | number | y-coordinate |
| **Optional properties** | **Type of value** | **Comment** |
| base | string | for fix node |
| idloc | number | position of string |

## **[*Constraints*](https://goessner.github.io/mec2/microjam.md/getting_started.html#nodes)**

<aside style="min-width:50%">

```Html
<mec-2 width="200" height="250" grid cartesian nodelabels>
{
    "nodes": [
        {
            "id":"A0", "x": 100, "y": 100, "base": true
        }, {
            "id":"A", "x": 100, "y": 180
        }
    ],
    "constraints": [
        {
            "id":"a","p1":"A0","p2":"A",
            "len":{"type":"const"},
            "ori":{"type":"drive","repeat":5,"Dt":3 }
        }
    ]
}  
</mec-2>
````

##### example 2: Implementation of contraints

</aside>

The constraint defines the relationship between two nodes. i.e. in order to define a constraint, two nodes must first of all be defined.

| Required properties | Type of value | Comment |
|---|---|---|
| id | string | the name of the constraint |
| p1 | string | first point |
| p2 | string | second point |
| len | string | it must be specified whether the length between two nodes is variable or constant |
| ori | string | it must be specified whether the orientation (angle) between two nodes is variable or constant |
| **Optional properties** | **Type of value** | **Comment** |
| drive | boolean | define the movement of rotation between two nodes |

<figure>
<mec-2 width="200" height="250" grid cartesian nodelabels>
{
    "nodes": [
        {
            "id":"A0", "x": 100, "y": 100, "base": true
        }, {
            "id":"A", "x": 100, "y": 180
        }
    ],
    "constraints": [
        {
            "id":"a","p1":"A0","p2":"A",
            "len":{"type":"const"},
            "ori":{"type":"drive","repeat":5,"Dt":3 }
        }
    ]
}  
</mec-2>

##### fig 2: Result of constraints

</figure>

## **[*Loads*](https://goessner.github.io/mec2/microjam.md/loads.html)**

we have two main types of loads. firstly forces and secondly springs:

### Forces

<aside>

<mec-2 width="250" height="250" grid cartesian nodelabels>
{
    "gravity": true,    
    "nodes": [       
        { "id": "A0", "x": 100, "y": 120, "base": true},
        { "id": "A",   "x": 200, "y": 120 }
    ],    
    "constraints": [
        { "id": "a", "p1": "A0", "p2": "A", "len": {"type": "const"}}
    ] ,
    "loads":[{
        "id":"F1","type":"force","p":"A",
        "value":30,"w0":1.5708,"mode":"push"
    }]
}
</mec-2>

##### fig 3: result of forces
</aside>

| Required properties | Type of value | Comment |
|---|---|---|
| id | string | the name of the node |
| type | string | y-coordinate |
| p | string | point of application |
| w0 | number | angle of application |
| mode | string | direction |

```Html
<mec-2 width="300" height="300" grid cartesian nodelabels>
{
    "gravity": true,    
    "nodes": [       
        { "id": "A0", "x": 100, "y": 120, "base": true},
        { "id": "A",   "x": 200, "y": 120 }
    ],    
    "constraints": [
        { "id": "a", "p1": "A0", "p2": "A", "len": {"type": "const"}}
    ] ,
    "loads":[{
        "id":"F1","type":"force","p":"A",
        "value":30,"w0":1.5708,"mode":"push"
    }]
}
</mec-2>
```
##### example 3: Implementation of force

  ### Springs

<aside>

<mec-2 width="350" height="300" grid cartesian nodelabels>
{   
    "nodes": [
        { "id": "A0","x":200,"y": 200, "base": true },
        { "id": "B0","x":100,"y": 100, "base": true },
        { "id": "A","x": 200, "y": 100 }
    ],
    "constraints": [
        {
            "id": "b","p1": "B0","p2": "A",
            "len": { "type": "const" }
        }
    ],
    "loads": [{
        "id": "a", "type" :"spring",
        "p1": "A0", "p2": "A", "k": 20
    }]
}
</mec-2>

##### fig 4: Result of springs

</aside>

| Required properties | Type of value | Comment |
|---|---|---|
| id | string | the name of the node |
| type | string | y-coordinate |
| p1 | string | first point of application |
| p1 | string | second point of application |
| k | number | spring constante |

```Html
<mec-2 width="350" height="300" grid cartesian nodellabels>
{   
    "nodes": [
        { "id": "A0","x":200,"y": 200, "base": true },
        { "id": "B0","x":100,"y": 100, "base": true },
        { "id": "A","x": 200, "y": 100 }
    ],
    "constraints": [
        {
            "id": "b","p1": "B0","p2": "A",
            "len": { "type": "const" }
        }
    ],
    "loads": [{
        "id": "a", "type" :"spring",
        "p1": "A0", "p2": "A", "k": 20
    }]
}
</mec-2>
```
##### Example 4: Implementation of springs

<aside>
<mec-2 width="350" height="350" x0="0" y0="0" grid cartesian nodelabels>
{
    "nodes": [
        { "id": "A0", "x": 75, "y": 50, "base": true },
        { "id": "A", "x": 75, "y": 100 },
        { "id": "B", "x": 275, "y": 170 },
        { "id": "B0", "x": 275, "y": 50, "base": true },
        { "id": "C", "x": 125, "y": 175 }
    ],
    "constraints": [
        {
            "id": "a", "p1": "A0", "p2": "A", "len": { "type":"const" },
            "ori": { "type": "drive", "Dt": 2, "Dw": 6.28 }
        }, {
            "id": "b", "p1": "A", "p2": "B", "len": { "type":"const" }
        }, {
            "id": "c", "p1": "B0", "p2": "B", "len": { "type":"const" }
        }, {
            "id": "d", "p1": "B", "p2": "C", "len": { "type":"const" },
            "ori": { "ref": "b", "type": "const" }
        }
    ],
    "views": [
        {
            "show": "pos", "of": "C", "as": "trace", "Dt":2.1,
            "mode":"preview", "fill":"orange"
        }, {
            "show": "vel", "of": "C", "as": "vector"
        }
    ]
}
</mec-2>

##### fig 5: result of views

</aside>

## **[*Views*](https://goessner.github.io/mec2/microjam.md/views.html)**

Views can be used to make different properties of the model or single elements of the model visible.

| Required properties | Type of value | Comment |
|---|---|---|
| show | string | Which property is to be shown |
| of | string | The `id` of the respective element |
| as | string | Which type of `view` is to be used |
| Dt | number | Time interval of the view to be active |
| **Optional properties** | **Type of value** | **Comment** |
| vector | string | to show a vector with a conforming orientation and length |
| trace | string | to show the movement of a point |
| info | string | to show an info cart |
| chart | string | to show coherences between different entities |

```Html
<aside>
<mec-2 width="350" height="350" x0="0" y0="0" grid cartesian nodelabels>
{
    "nodes": [
        { "id": "A0", "x": 75, "y": 50, "base": true },
        { "id": "A", "x": 75, "y": 100 },
        { "id": "B", "x": 275, "y": 170 },
        { "id": "B0", "x": 275, "y": 50, "base": true },
        { "id": "C", "x": 125, "y": 175 }
    ],
    "constraints": [
        {
            "id": "a", "p1": "A0", "p2": "A", "len": { "type":"const" },
            "ori": { "type": "drive", "Dt": 2, "Dw": 6.28 }
        }, {
            "id": "b", "p1": "A", "p2": "B", "len": { "type":"const" }
        }, {
            "id": "c", "p1": "B0", "p2": "B", "len": { "type":"const" }
        }, {
            "id": "d", "p1": "B", "p2": "C", "len": { "type":"const" },
            "ori": { "ref": "b", "type": "const" }
        }
    ],
    "views": [
        {
            "show": "pos", "of": "C", "as": "trace", "Dt":2.1,
            "mode":"preview", "fill":"orange"
        }, {
            "show": "vel", "of": "C", "as": "vector"
        }
    ]
}
</mec-2>
```
##### example 5: implementation of views

## [*Shapes*](https://goessner.github.io/mec2/microjam.md/shapes.html)

<aside>
<mec-2 width="401" height="301" grid cartesian x0="50" y0="25" nodelabes>
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

  ##### fig 6: result of shapes
  </aside>

to stylize elements with geometric forms or images.

| Required properties | Type of value | Comment |
|---|---|---|
| type | string | which shake should be used |
| uri | string | the source of an image if we want to insert images from the Internet |
| p | string | point of application |

```Html
<mec-2 width="401" height="201" x0="50" y0="25" grid cartesian nodelabels >
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
##### example 6:Implementation of shapes
