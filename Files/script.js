class myGL {
    context = false;
    canvas_width;
    canvas_height;
    cubeShader;
    cubeBuffer;
    skyboxShader;
    skyboxBuffer;
    skyboxTexture;

    mx = 0.0;
    my = 0.0;
    mz = 0.0;
    mxRot = 0.0;
    myRot = 0.0;
    mzRot = 0.0;
    xspeedRot = 1.0 * Math.PI / 180;
    yspeedRot = 1.0 * Math.PI / 180;
    zspeedRot = 1.0 * Math.PI / 180;
    cx = 2.0;
    cy = 1.0;
    cz = 1.0;
    fov = 90.00;
    reflectRatio = 0.3;

    constructor(context, canvas_width, canvas_height) {
        this.context = context;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
    }
}

var skyboxGL, emGL;
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
const fSize = 4;

var flag_skybox = true;
var flag_rotate = false;
var depth_clear_value = 1.0;

const num_cubeVertex = 36;
var cubeVertices = [
    // positions       // normals       // rgb
    // front
     0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.4, 0.4, 0.4,
    -0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.4, 0.4, 0.4,
     0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.4, 0.4, 0.4,
    -0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.5, 0.5, 0.5,
     0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.5, 0.5, 0.5,
    -0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.5, 0.5, 0.5,
    // back
     0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.5, 0.5, 0.5,
     0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.5, 0.5, 0.5,
    -0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.5, 0.5, 0.5,
    -0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.4, 0.4, 0.4,
    -0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.4, 0.4, 0.4,
     0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.4, 0.4, 0.4,
    // right
    0.5,  0.5,  0.5,  1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    0.5, -0.5,  0.5,  1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    0.5,  0.5, -0.5,  1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    0.5, -0.5, -0.5,  1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    0.5,  0.5, -0.5,  1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    0.5, -0.5,  0.5,  1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    // left
    -0.5,  0.5,  0.5, -1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    -0.5,  0.5, -0.5, -1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    -0.5, -0.5,  0.5, -1.0,  0.0,  0.0, 0.4, 0.4, 0.4,
    -0.5, -0.5, -0.5, -1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    -0.5, -0.5,  0.5, -1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    -0.5,  0.5, -0.5, -1.0,  0.0,  0.0, 0.5, 0.5, 0.5,
    // top
     0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.4, 0.4, 0.4,
    -0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.4, 0.4, 0.4,
     0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.4, 0.4, 0.4,
    -0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.5, 0.5, 0.5,
     0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.5, 0.5, 0.5,
    -0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.5, 0.5, 0.5,
    // bottom
     0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.5, 0.5, 0.5,
    -0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.5, 0.5, 0.5,
     0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.5, 0.5, 0.5,
    -0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.4, 0.4, 0.4,
     0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.4, 0.4, 0.4,
    -0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.4, 0.4, 0.4
];

const num_skyboxVertex = 36;
var skyboxVertices = [
    // positions
    // front
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    // back
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // right
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0,  1.0,
    // left
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0, -1.0,
    // top
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    // bottom
     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0
];

function testGLError(gl, functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.context.getError();

    if (lastError != gl.context.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvasName) {
    var gl;

    try {
        var canvas = document.getElementById(canvasName);
        gl = new myGL(canvas.getContext('webgl', {stencil:true, alpha:true, depth:true, antialias:true, preserveDrawingBuffer:false}),
        canvas.width, canvas.height);
        gl.context.viewport(0, 0, canvas.width, canvas.height);
    }
    catch(e) {
        console.log(e);
    }

    if(!gl.context)
    {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return gl;
}

function initialiseBuffer(gl) {
    // cube를 위한 buffer 생성 및 연결
    gl.cubeBuffer = gl.context.createBuffer();
    gl.context.bindBuffer(gl.context.ARRAY_BUFFER, gl.cubeBuffer);
    gl.context.bufferData(gl.context.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.context.DYNAMIC_DRAW);

    // skybox를 위한 buffer 생성 및 연결
    gl.skyboxBuffer = gl.context.createBuffer();
    gl.context.bindBuffer(gl.context.ARRAY_BUFFER, gl.skyboxBuffer);
    gl.context.bufferData(gl.context.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.context.DYNAMIC_DRAW);

    // skybox texture를 위한 buffer 생성 및 연결
    var texData = new Array();
    // +x, right, Blue, White
    texData.push(new Uint8Array([
        0, 0, 255, 255,     255, 255, 255, 255, 0, 0, 255, 255,     255, 255, 255, 255,
        255, 255, 255, 255, 0, 0, 255, 255,     255, 255, 255, 255, 0, 0, 255, 255,
        0, 0, 255, 255,     255, 255, 255, 255, 0, 0, 255, 255,     255, 255, 255, 255,
        255, 255, 255, 255, 0, 0, 255, 255,     255, 255, 255, 255, 0, 0, 255, 255
    ]));
    // -x, left, Cyan, White
    texData.push(new Uint8Array([
        0, 255, 255, 255,   255, 255, 255, 255, 0, 255, 255, 255,   255, 255, 255, 255,
        255, 255, 255, 255, 0, 255, 255, 255,   255, 255, 255, 255, 0, 255, 255, 255,
        0, 255, 255, 255,   255, 255, 255, 255, 0, 255, 255, 255,   255, 255, 255, 255,
        255, 255, 255, 255, 0, 255, 255, 255,   255, 255, 255, 255, 0, 255, 255, 255
    ]));
    // +y, top, Red, Black
    texData.push(new Uint8Array([
        0, 0, 0, 0,         255, 0, 0, 255,     0, 0, 0, 0,         255, 0, 0, 255,
        255, 0, 0, 255,     0, 0, 0, 0,         255, 0, 0, 255,     0, 0, 0, 0,
        0, 0, 0, 0,         255, 0, 0, 255,     0, 0, 0, 0,         255, 0, 0, 255,
        255, 0, 0, 255,     0, 0, 0, 0,         255, 0, 0, 255,     0, 0, 0, 0
    ]));
    // -y, bottom, Green, Black
    texData.push(new Uint8Array([
        0, 0, 0, 0,         0, 255, 0, 255,     0, 0, 0, 0,         0, 255, 0, 255,
        0, 255, 0, 255,     0, 0, 0, 0,         0, 255, 0, 255,     0, 0, 0, 0,
        0, 0, 0, 0,         0, 255, 0, 255,     0, 0, 0, 0,         0, 255, 0, 255,
        0, 255, 0, 255,     0, 0, 0, 0,         0, 255, 0, 255,     0, 0, 0, 0
    ]));
    // +z, front, Magenta, White
    texData.push(new Uint8Array([
        255, 0, 255, 255,   255, 255, 255, 255, 255, 0, 255, 255,   255, 255, 255, 255,
        255, 255, 255, 255, 255, 0, 255, 255,   255, 255, 255, 255, 255, 0, 255, 255,
        255, 0, 255, 255,   255, 255, 255, 255, 255, 0, 255, 255,   255, 255, 255, 255,
        255, 255, 255, 255, 255, 0, 255, 255,   255, 255, 255, 255, 255, 0, 255, 255
    ]));
    // -z, back, Yellow, White
    texData.push(new Uint8Array([
        255, 255, 255, 255, 255, 255, 0, 255,   255, 255, 255, 255, 255, 255, 0, 255,
        255, 255, 0, 255,   255, 255, 255, 255, 255, 255, 0, 255,   255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 0, 255,   255, 255, 255, 255, 255, 255, 0, 255,
        255, 255, 0, 255,   255, 255, 255, 255, 255, 255, 0, 255,   255, 255, 255, 255
    ]));
	gl.skyboxTexture = loadCubemap(gl.context, texData);

    return testGLError(gl, "initialiseBuffers");
}

function loadCubemap(context, texData) {
    // cubemap texture를 만들어 buffer와 연결한다.
    texture = context.createTexture();
    context.bindTexture(context.TEXTURE_CUBE_MAP, texture);

    // cube map texutre에 texture image를 넣어준다.
    for(var i = 0; i < 6; i++)
    {
        if (texData)
            context.texImage2D(context.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, context.RGBA, 4, 4, 0, context.RGBA, context.UNSIGNED_BYTE, texData[i]);
        else
            alert("Cubemap texture failed to load at path: " + texData[i]);
    }

    context.generateMipmap(context.TEXTURE_CUBE_MAP);
    context.texParameteri(context.TEXTURE_CUBE_MAP, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_NEAREST);
    context.texParameteri(context.TEXTURE_CUBE_MAP, context.TEXTURE_MAG_FILTER, context.NEAREST);

    return texture;
}

function initialiseShaders(gl) {
    // =================== cube shader ===================
    const cubeVS = `
        attribute highp vec3 aPos;
        attribute highp vec3 aNormal;
        attribute mediump vec3 aColor;

        uniform mediump mat4 pMat;
        uniform mediump mat4 vMat;
        uniform mediump mat4 mMat;

        varying highp vec3 position;
        varying highp vec3 normal;
        varying mediump vec3 color;

        void main()
        {
            position = vec3(mMat * vec4(aPos, 1.0));
            normal = vec3(mMat * vec4(aNormal, 0.0));
            color = aColor;
            
            gl_Position = pMat * vMat * mMat * vec4(aPos, 1.0);
        }
    `;
    const cubeFS = `
        uniform highp vec3 cameraPos;
        uniform highp float reflectRatio;
        uniform samplerCube skyboxTex;
        

        varying highp vec3 position;
        varying highp vec3 normal;
        varying mediump vec3 color;

        void main()
        {
            highp vec3 I = normalize(position - cameraPos);
            highp vec3 R = reflect(I, normalize(normal));
            gl_FragColor = vec4((1.0 - reflectRatio) * color, 1.0) + vec4(reflectRatio * textureCube(skyboxTex, R).rgb, 1.0);
        }
    `;
    const cubeAttributes = ['aPos', 'aNormal', 'aColor'];

    // 만든 shader를 이용해 programObject를 만들어준다.
    gl.cubeShader = makeShaderProgram(gl.context, cubeVS, cubeFS, cubeAttributes);
    gl.context.linkProgram(gl.cubeShader);
    if (!gl.context.getProgramParameter(gl.cubeShader, gl.context.LINK_STATUS))
    {
        alert("Failed to link the program.\n" + gl.context.getProgramInfoLog(gl.cubeShader));
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
    gl.skyboxShader = makeShaderProgram(gl.context, skyboxVS, skyboxFS, skyboxAttributes);
    gl.context.linkProgram(gl.skyboxShader);
    if (!gl.context.getProgramParameter(gl.skyboxShader, gl.context.LINK_STATUS))
    {
        alert("Failed to link the program.\n" + gl.context.getProgramInfoLog(gl.skyboxShader));
        return false;
    }

    return testGLError(gl, "initialiseShaders");
}

function makeShaderProgram(context, vs, fs, attributes) {
    // vertex shader 생성 및 컴파일
    vsID = context.createShader(context.VERTEX_SHADER);
    context.shaderSource(vsID, vs);
    context.compileShader(vsID);
    if (!context.getShaderParameter(vsID, context.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + context.getShaderInfoLog(vsID));
        return false;
    }
    // fragment shader 생성 및 컴파일
    fsID = context.createShader(context.FRAGMENT_SHADER);
    context.shaderSource(fsID, fs);
    context.compileShader(fsID);
    if (!context.getShaderParameter(fsID, context.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + context.getShaderInfoLog(fsID));
        return false;
    }

    // shader program 생성 및 정의
    programID = context.createProgram();
    context.attachShader(programID, vsID);
    context.attachShader(programID, fsID);
    for(var i = 0; i < attributes.length; i++)
        context.bindAttribLocation(programID, i, attributes[i]);

    return programID;
}

function renderScene(gl) {
    gl.context.enable(gl.context.DEPTH_TEST);

    gl.context.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.context.clearDepth(depth_clear_value);
	gl.context.clear(gl.context.COLOR_BUFFER_BIT | gl.context.DEPTH_BUFFER_BIT);
	
    var cameraPos;
    if(gl.cx == 0 && gl.cy != 0 && gl.cz == 0)
        cameraPos = [0.0001, gl.cy, 0];
    else
        cameraPos = [gl.cx, gl.cy, gl.cz];
    
    // projection, view, model matrix로 시야 및 model의 상태 조절
	var pMat = mat4.create();
	var vMat = mat4.create();
	var mMat = mat4.create();
	mat4.perspective(pMat, gl.fov * Math.PI / 180.0 , gl.canvas_width/gl.canvas_height, 0.5, 20);
	mat4.lookAt(vMat, cameraPos, [gl.mx, gl.my, gl.mz], [0,1,0]);
    mat4.translate(mMat, mMat, [gl.mx, gl.my, gl.mz]);
	mat4.rotateX(mMat, mMat, gl.mxRot);
	mat4.rotateY(mMat, mMat, gl.myRot);
	mat4.rotateZ(mMat, mMat, gl.mzRot);

    if (gl == emGL && flag_rotate)
	{
        gl.mxRot = gl.mxRot + gl.xspeedRot;	
        gl.myRot = gl.myRot + gl.yspeedRot;	
        gl.mzRot = gl.mzRot + gl.zspeedRot;	
    }
    var pMatID;
    var vMatID;
    var mMatID;         // cube에서만 사용
    var cameraPosID;    // cube에서만 사용
    var skyboxTexID;

    // =================== cube rendering ===================
    gl.context.useProgram(gl.cubeShader);

    // cubeShader의 uniform 변수들의 위치를 찾아 저장
    pMatID = gl.context.getUniformLocation(gl.cubeShader, "pMat");
    vMatID = gl.context.getUniformLocation(gl.cubeShader, "vMat");
    mMatID = gl.context.getUniformLocation(gl.cubeShader, "mMat");
    reflectRatioID = gl.context.getUniformLocation(gl.cubeShader, "reflectRatio");
    cameraPosID = gl.context.getUniformLocation(gl.cubeShader, "cameraPos");
    skyboxTexID = gl.context.getUniformLocation(gl.cubeShader, "skyboxTex");

    // 저장중인 변수들을 cubeShader의 uniform으로 연결
    gl.context.uniformMatrix4fv(pMatID, gl.context.FALSE, pMat);
    gl.context.uniformMatrix4fv(vMatID, gl.context.FALSE, vMat);
    gl.context.uniformMatrix4fv(mMatID, gl.context.FALSE, mMat);
    gl.context.uniform1f(reflectRatioID, gl.reflectRatio);
    if (!testGLError(gl, "cube uniformMatrix")) {
        return false;
    }
    gl.context.uniform3fv(cameraPosID, cameraPos);
    if (!testGLError(gl, "cube uniform3")) {
        return false;
    }

    // 저장중인 texture를 cubeShader의 uniform으로 연결
    gl.context.activeTexture(gl.context.TEXTURE0);
    gl.context.bindTexture(gl.context.TEXTURE_CUBE_MAP, gl.skyboxTexture);
    gl.context.uniform1i(skyboxTexID, 0);
    if (!testGLError(gl, "cube uniform1")) {
        return false;
    }

    // buffer 연결 및 primitive 생성
    gl.context.bindBuffer(gl.context.ARRAY_BUFFER, gl.cubeBuffer);
    gl.context.enableVertexAttribArray(0);
    gl.context.vertexAttribPointer(0, 3, gl.context.FLOAT, gl.context.FALSE, 9 * fSize, 0);
    gl.context.enableVertexAttribArray(1);
    gl.context.vertexAttribPointer(1, 3, gl.context.FLOAT, gl.context.FALSE, 9 * fSize, 3 * fSize);
    gl.context.enableVertexAttribArray(2);
    gl.context.vertexAttribPointer(2, 3, gl.context.FLOAT, gl.context.FALSE, 9 * fSize, 6 * fSize);
    if (!testGLError(gl, "gl.context.vertexAttribPointer")) {
        return false;
    }
    gl.context.drawArrays(gl.context.TRIANGLES, 0, num_cubeVertex);
    // =================== skybox rendering ===================
    if(!(gl == skyboxGL && !flag_skybox))
    {
        gl.context.depthFunc(gl.context.LEQUAL);    // skybox를 위한 depth test 설정

        gl.context.useProgram(gl.skyboxShader);

        // skyboxShader의 uniform 변수들의 위치를 찾아 저장
        pMatID = gl.context.getUniformLocation(gl.skyboxShader, "pMat");
        vMatID = gl.context.getUniformLocation(gl.skyboxShader, "vMat");
        skyboxTexID = gl.context.getUniformLocation(gl.skyboxShader, "skyboxTex");

        // 저장중인 matrix를 skyboxShader의 uniform으로 연결
        gl.context.uniformMatrix4fv(pMatID, gl.context.FALSE, pMat);
        gl.context.uniformMatrix4fv(vMatID, gl.context.FALSE, vMat);
        if (!testGLError(gl, "skybox uniformMatrix")) {
            return false;
        }
        // 저장중인 texture를 skyboxShader의 uniform으로 연결
        gl.context.activeTexture(gl.context.TEXTURE0);
        gl.context.bindTexture(gl.context.TEXTURE_CUBE_MAP, gl.skyboxTexture);
        gl.context.uniform1i(skyboxTexID, 0);
        if (!testGLError(gl, "skybox uniform1")) {
            return false;
        }

        // buffer 연결 및 primitive 생성
        gl.context.bindBuffer(gl.context.ARRAY_BUFFER, gl.skyboxBuffer);
        gl.context.enableVertexAttribArray(0);
        gl.context.vertexAttribPointer(0, 3, gl.context.FLOAT, gl.context.FALSE, 3 * fSize, 0);
        if (!testGLError(gl, "gl.context.vertexAttribPointer")) {
            return false;
        }
        gl.context.drawArrays(gl.context.TRIANGLES, 0, num_skyboxVertex);

        gl.context.depthFunc(gl.context.LESS);      // depth test 설정 초기화
    }

    return true;
}

function main() {
    skyboxGL = initialiseGL('skyboxCanvas');
    emGL = initialiseGL('emCanvas');
    if (!skyboxGL.context || !emGL.context) {
        return;
    }
    skyboxGL.reflectRatio = 0.0;
    skyboxGL.cy = 0.0;
    skyboxGL.cz = 0.0;

    if (!initialiseShaders(skyboxGL) || !initialiseShaders(emGL)) {
        return;
    }

    if (!initialiseBuffer(skyboxGL) || !initialiseBuffer(emGL)) {
        return;
    }

    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000, 60);
            };
    })();

    (function renderLoop() {
        if (renderScene(skyboxGL) && renderScene(emGL)) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}