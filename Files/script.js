var gl;
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
const fSize = 4;

var canvas_width = 0.0;
var canvas_height = 0.0;

// shader, buffer 저장
var cubeShader;
var cubeBuffer;
var skyboxShader;
var skyboxBuffer;

// var mMat, vMat, pMat;
var baseColor = [0.5, 0.5, 0.5];
var cameraPos = [2.0, 2.0, 2.0];
var xRot = 0.0;
var yRot = 0.0;
var zRot = 0.0;
var depth_clear_value = 1.0;
var fov_degree = 90.0;

const num_cubeVertex = 36;
var cubeVertices = [
    // positions       // normals
    // front
    -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
     0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
     0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
     0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
    -0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
    -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
    // back
    -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
     0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
     0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
     0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
    -0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
    -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
    // right
    0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
    0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
    0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
    0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
    0.5, -0.5,  0.5,  1.0,  0.0,  0.0, 
    0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
    // left
    -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
    -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,
    -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
    -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
    -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
    -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
    // top
    -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
     0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
     0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
     0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
    -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
    -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
    // bottom
    -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
     0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
     0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
     0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
    -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
    -0.5, -0.5, -0.5,  0.0, -1.0,  0.0
];

const num_skyboxVertex = 36;
var skyboxVertices = [
    // positions
    // front
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // back
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    // right
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,
    // left
    -1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,
    // top
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    // bottom
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0
];

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        gl = canvas.getContext('webgl',
			{stencil:true, alpha:true, depth:true, antialias:true, preserveDrawingBuffer:false});
        canvas_width = canvas.width;
        canvas_height = canvas.height;            
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.DEPTH_TEST)
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

function initialiseBuffer() {
    // cube를 위한 buffer 생성 및 연결
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.DYNAMIC_DRAW);

    // skybox를 위한 buffer 생성 및 연결
    skyboxBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.DYNAMIC_DRAW);

    // skybox texture를 위한 buffer 생성 및 연결
    var texData = new Array();
    texData.push(new Uint8Array([
        255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255,
        128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255,
        128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255
    ]));
    texData.push(new Uint8Array([
        255, 255, 255, 255, 128, 255, 128, 255, 255, 255, 255, 255, 128, 255, 128, 255,
        128, 255, 128, 255, 255, 255, 255, 255, 128, 255, 128, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 128, 255, 128, 255, 255, 255, 255, 255, 128, 255, 128, 255,
        128, 255, 128, 255, 255, 255, 255, 255, 128, 255, 128, 255, 255, 255, 255, 255
    ]));
    texData.push(new Uint8Array([
        255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255,
        255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255,
        255, 128, 128, 255, 255, 255, 255, 255, 255, 128, 128, 255, 255, 255, 255, 255
    ]));
    texData.push(new Uint8Array([
        255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255,
        128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255,
        128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255,
    ]));
    texData.push(new Uint8Array([
        255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255,
        255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255,
        255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255
    ]));
    texData.push(new Uint8Array([
        255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255,
        255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255,
        255, 255, 128, 255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 255, 255
    ]));
	skyboxTexture = loadCubemap(texData);

    return testGLError("initialiseBuffers");
}

function loadCubemap(texData) {
    // cubemap texture를 만들어 buffer와 연결한다.
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    // cube map texutre에 texture image를 넣어준다.
    for(var i = 0; i < 6; i++)
    {
        if (texData)
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 4, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData[i]);
        else
            alert("Cubemap texture failed to load at path: " + texData[i]);
    }

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    

    return texture;
}

function initialiseShaders() {
    // =================== cube shader ===================
    const cubeVS = `
        attribute highp vec3 aPos;
        attribute highp vec3 aNormal;

        uniform mediump mat4 pMat;
        uniform mediump mat4 vMat;
        uniform mediump mat4 mMat;

        varying highp vec3 position;
        varying highp vec3 normal;

        void main()
        {
            position = aPos;
            normal = aNormal;
            
            gl_Position = pMat * vMat * mMat * vec4(aPos, 1.0);
        }
    `;
    const cubeFS = `
        uniform highp vec3 baseColor;
        uniform highp vec3 cameraPos;
        uniform samplerCube skyboxTex;

        varying highp vec3 position;
        varying highp vec3 normal;

        void main()
        {
            highp vec3 I = normalize(position - cameraPos);
            highp vec3 R = reflect(I, normalize(normal));
            gl_FragColor = vec4(0.5 * baseColor, 1.0) + vec4(0.5 * textureCube(skyboxTex, R).rgb, 1.0);
        }
    `;
    const cubeAttributes = ['aPos', 'aNormal'];

    // 만든 shader를 이용해 programObject를 만들어준다.
    cubeShader = makeShaderProgram(cubeVS, cubeFS, cubeAttributes);
    gl.linkProgram(cubeShader);
    if (!gl.getProgramParameter(cubeShader, gl.LINK_STATUS))
    {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(cubeShader));
        return false;
    }

    // =================== skybox shader ===================
    const skyboxVS = `
        attribute highp vec3 aPos;

        uniform mediump mat4 pMat;
        uniform mediump mat4 vMat;

        varying highp vec3 texCoords;

        void main()
        {
            texCoords = aPos;
            vec4 pos = pMat * vMat * vec4(aPos, 0.0);
            gl_Position = pos.xyww;
        }
    `;
    const skyboxFS = `
        uniform samplerCube skyboxTex;

        varying highp vec3 texCoords;
        
        void main()
        {
            gl_FragColor = vec4(textureCube(skyboxTex, texCoords).rgb, 1.0) ;
        }
    `;
    const skyboxAttributes = ['aPos'];

    // 만든 shader를 이용해 programObject를 만들어준다.
    skyboxShader = makeShaderProgram(skyboxVS, skyboxFS, skyboxAttributes);
    gl.linkProgram(skyboxShader);
    if (!gl.getProgramParameter(skyboxShader, gl.LINK_STATUS))
    {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(skyboxShader));
        return false;
    }

    return testGLError("initialiseShaders");
}

function makeShaderProgram(vs, fs, attributes) {
    // vertex shader 생성 및 컴파일
    vsID = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsID, vs);
    gl.compileShader(vsID);
    if (!gl.getShaderParameter(vsID, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(vsID));
        return false;
    }
    // fragment shader 생성 및 컴파일
    fsID = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsID, fs);
    gl.compileShader(fsID);
    if (!gl.getShaderParameter(fsID, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(fsID));
        return false;
    }

    // shader program 생성 및 정의
    programID = gl.createProgram();
    gl.attachShader(programID, vsID);
    gl.attachShader(programID, fsID);
    for(var i = 0; i < attributes.length; i++)
        gl.bindAttribLocation(programID, i, attributes[i]);

    return programID;
}

function renderScene() {
    gl.clearColor(0.5, 0.5, 0.5, 0.0);
	gl.clearDepth(depth_clear_value);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
    // projection, view, model matrix로 시야 및 model의 상태 조절
	var pMat = mat4.create();
	var vMat = mat4.create();
	var mMat = mat4.create();
	mat4.perspective(pMat, fov_degree * Math.PI / 180.0 , canvas_width/canvas_height, 0.5, 6);
	mat4.lookAt(vMat, cameraPos, [0.0 ,0.0, 0.0], [0,1,0]);
	mat4.rotateX(mMat, mMat, xRot);
	mat4.rotateY(mMat, mMat, yRot);
	mat4.rotateZ(mMat, mMat, zRot);

    // if (flag_animation == 1)
	// {
	// 	xRot = xRot + speedRot;	
	// 	yRot = yRot + speedRot;	
	// 	zRot = zRot + speedRot;	
    // }
    var pMatID;
    var vMatID;
    var mMatID;         // cube에서만 사용
    var baseColorID;    // cube에서만 사용
    var cameraPosID;    // cube에서만 사용
    var skyboxTexID;

    // =================== cube rendering ===================
    gl.useProgram(cubeShader);

    // cubeShader의 uniform 변수들의 위치를 찾아 저장
    pMatID = gl.getUniformLocation(cubeShader, "pMat");
    vMatID = gl.getUniformLocation(cubeShader, "vMat");
    mMatID = gl.getUniformLocation(cubeShader, "mMat");
    baseColorID = gl.getUniformLocation(cubeShader, "baseColor");
    cameraPosID = gl.getUniformLocation(cubeShader, "cameraPos");
    skyboxTexID = gl.getUniformLocation(cubeShader, "skyboxTex");

    // 저장중인 변수들을 cubeShader의 uniform으로 연결
	gl.uniformMatrix4fv(pMatID, gl.FALSE, pMat);
	gl.uniformMatrix4fv(vMatID, gl.FALSE, vMat);
    gl.uniformMatrix4fv(mMatID, gl.FALSE, mMat);
    if (!testGLError("cube uniformMatrix")) {
        return false;
    }
    gl.uniform3fv(baseColorID, baseColor);
    gl.uniform3fv(cameraPosID, cameraPos);
    if (!testGLError("cube uniform3")) {
        return false;
    }

    // 저장중인 texture를 cubeShader의 uniform으로 연결
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
    gl.uniform1i(skyboxTexID, 0);
    if (!testGLError("cube uniform1")) {
        return false;
    }

    // buffer 연결 및 primitive 생성
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 6 * fSize, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 6 * fSize, 3 * fSize);
    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }
    gl.drawArrays(gl.TRIANGLES, 0, num_cubeVertex);

    // =================== skybox rendering ===================
    gl.depthFunc(gl.LEQUAL);    // skybox를 위한 depth test 설정

    gl.useProgram(skyboxShader);

    // skyboxShader의 uniform 변수들의 위치를 찾아 저장
    pMatID = gl.getUniformLocation(skyboxShader, "pMat");
    vMatID = gl.getUniformLocation(skyboxShader, "vMat");
    skyboxTexID = gl.getUniformLocation(skyboxShader, "skyboxTex")
    // 저장중인 matrix를 skyboxShader의 uniform으로 연결
	gl.uniformMatrix4fv(pMatID, gl.FALSE, pMat);
	gl.uniformMatrix4fv(vMatID, gl.FALSE, vMat);
    if (!testGLError("skybox uniformMatrix")) {
        return false;
    }
    // 저장중인 texture를 skyboxShader의 uniform으로 연결
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
    gl.uniform1i(skyboxTexID, 0);
    if (!testGLError("skybox uniform1")) {
        return false;
    }

    // buffer 연결 및 primitive 생성
    gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * fSize, 0);
    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }
    gl.drawArrays(gl.TRIANGLES, 0, num_skyboxVertex);

    gl.depthFunc(gl.LESS);      // depth test 설정 초기화


    return true;
}

function main() {
    var canvas = document.getElementById("test");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
                window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
