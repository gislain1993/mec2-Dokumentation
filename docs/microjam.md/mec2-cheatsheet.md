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

## **mec2-cheatsheet**

For the using of these `code` we have to need to write the scale: ```<mec-2 width="400" height="300" grid cartesian>``` write your code hier ``` </mec2>```.

If you want to know more about ```mec2```  i recommend you to read more about the documentation [hier](#http://gislain1993.github.io/mec2-Dokumentation).


### **1.Modul: [*Nodes*](https://goessner.github.io/mec2/microjam.md/getting_started.html#nodes)**

 Comment | Example 1 | Properties  | Options | Example2
:-------- | :--------: | :--------:  | :--------:  | --------:  |
create a node by giving the coordinate and one ```id``` |```"nodes": [{ "id": "A", "x":50,"y":200}]``` | x,y | **.base:**`"true"` or `"false"`  **-idloc:** `"ne"` | "nodes": {"id":"A0", "x": 150, "y": 120, "base": true}]


### **2.Modul: [*Constraints*](https://goessner.github.io/mec2/microjam.md/getting_started.html#nodes)**


 Comment | Example 1 | Properties | Options | Example2
:-------- | :--------: | :--------:  | :--------:  | --------:  |
create a relationship between two nodes |```"constraints":[{"id": "a", "p1": "A", "p2": "B","len": { "type": "const" },"ori": { "type": "const"}}```| p1, p2 | . Drive | ```"constraints": [{"id":"a","p1":"A0","p2":"A","len":{"type":"const"},"ori":{"type":"drive","repeat":10,"Dt":3 }}]```

### **2.1 [*Drive*](https://goessner.github.io/mec2/microjam.md/drive.html)**:

 Functions | Comment | Properties | Example 
:-------- | :--------: | :--------:  | --------:  |
drive sequence  |  define a drive in many segments | Dt, Dw, func, ref, t0, repeat| ```"constraints": [{"id": "a", "p1": "A0", "p2": "A1","len": { "type": "const" },"ori": {"type": "drive",  "Dt": 3, "Dw": -3.14, "repeat":2,"func": "seq", "args": [{ "func": "quadratic", "dt": 3, "dz": 1 },{ "func": "const", "dt": 1 },{"func": "linear", "dt": 3, "dz": -1 }]}}]```

### **3.Modul: [*Loads*](https://goessner.github.io/mec2/microjam.md/loads.html)**

 Comment | Example 1 | Properties | Options | Example2
:-------- | :--------: | :--------:  | :--------:  | --------:  |
create a force or a spring | ```"Loads":[{"type":"force", "id":"A", "p": "A", "k":10, "w0":-1.57,"value":20}``` | k, w0, value, p, id | `spring` oder `force` | ```"loads": [{"id": "a", "type" :"spring","p1": "A0", "p2": "A", "k": 20}]```

### **4.Modul: [*Views*](https://goessner.github.io/mec2/microjam.md/views.html)**

 Comment | Example 1 | Properties | Options | Example2
:-------- | :--------: | :--------:  | :--------:  | --------:  |
 to make a propertie to the model visible  |```"views": [{ "show": "pole", "of": "b", "as": "trace","mode": "static", "t0": 0.02, "Dt": 9.98, "fill": "#90ee9088" }]``` | show, of, as, mode | vector, trace, info, chart  | ```"views": [{"show": "pos", "of": "C", "as": "trace", "Dt":2.1,"mode":"preview", "fill":"orange"}, {"show": "vel", "of": "C", "as": "vector"}]```

### **5.Modul: [*Shapes*](https://goessner.github.io/mec2/microjam.md/shapes.html)**

 Comment | Example 1 | Properties | Example2
:-------- | :--------: | :--------:  | :--------  | 
to stylize elements with geometric forms or images   |```"shapes": [{ "type": "fix", "p": "A0" },{ "type": "flt", "p": "B0" }]``` | fix, flt, slider, beam, wheel, poly, img | ```"shapes": [{ "type":"img","uri":"./img/cranks.png","p":"A0","xoff":220,"yoff":-50,"w0":-1.5708,"wref":"a","scl":0.4 },{ "type":"img","uri":"./img/hebel.png","p":"B","xoff":200,"yoff":-100,"w0":-1.5708,"wref":"a","scl":0.2 }]```