/////////////////////////////////////////////////////////////////////////////
//
//  Square.js
//

function Square(gl, vertexShader, fragmentShader) {

    vertexShader ||= "Square-vertex-shader";
    fragmentShader ||= "Square-fragment-shader";

    let program = initShaders(gl, vertexShader, fragmentShader);

    // Set up our data:
    //   - positions contains our vertex positions
    //   - indices contains how to organize the vertices
    //       into primitives
    //
    let positions = [
        0.0, 0.0, 0.0, // 0
        1.0, 0.0, 0.0, // 1
        1.0, 1.0, 0.0, // 2
		0.0, 1.0, 0.0, // 3
        0.0, 0.0, 1.0, // 4
		1.0, 0.0, 1.0, // 5
		1.0, 1.0, 1.0, // 6
		0.0, 1.0, 1.0 // 7
    ];

    let indices = [
        2, 3, 1, 
        3, 0, 1, // back
		3, 7, 0,
		7, 4, 0, // left
		7, 6, 4,
		6, 5, 4, // front
		6, 2, 5,
		2, 1, 5, // right
		6, 7, 3,
		3, 2, 6, // top
		5, 1, 0,
		4, 5, 0 // bottom
    ];

    // Initialize all of our WebGL "plumbing" variables
    //
    let aPosition = new Attribute(gl, program, positions,
	    "aPosition", 3, gl.FLOAT);

    indices = new Indices(gl, indices);

    let MV = new Uniform(gl, program, "MV");
    let P  = new Uniform(gl, program, "P");

    this.render = () => {
		

        gl.useProgram(program);

        aPosition.enable();
        indices.enable();

        MV.update(this.MV);
        P.update(this.P);
        gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);

        indices.disable();
        aPosition.disable();
    
    };
};
