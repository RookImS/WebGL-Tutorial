# CG WebGL Final Project

### WebGL1.0 Environment Mapping Tutorial

<div style="text-align: right">소프트웨어학과 201520854 김성건</div> 

---
## 주제 및 선정 동기

### 주제 : Environment Mapping
    
environment mapping은 빛의 반사나 굴절로 인해서 주변환경이 현실의 물체에 비치는 것을 컴퓨터 그래픽으로 구현하기 위해서 사용하는 texture를 활용한 기법이다. 기존의 그래픽 내 cube는 주변의 물체들이 비추지 않기 때문에 어색하게 보이지만 environment mapping을 활용해 주변 환경을 texture로 이용함으로써 cube과 자연스럽게 주변을 비추는 것을 구현할 수 있다. 

### 선정동기

수업을 통해서 shading을 배우면서 빛과 물체의 상호작용에 대해서 배울 수 있었다. 하지만 빛을 잘 반사시킨다는 것은 다르게 생각하면 거울처럼 다른 물체도 비춰서 잘 보일 것이라는 것을 의미했다. 하지만 수업의 내용만으로는 외부 환경과 물체와의 상호작용이 다뤄지지 않았기 때문에 궁금증이 생겨 교수님께 관련 질문을 했다. 이를 통해서 그래픽 내의 물체가 주변 환경과 상호작용하는 방식 중 흔하게 사용되는 것이 environment mapping이라는 것을 알 수 있었고, 이후에 개인적으로 조사해보니 공부를 하면 내가 충분히 설명을 할 수 있는 주제라고 생각했기 때문에 이를 주제로 선정했다.

## 주제에 관련한 핵심 내용

### cubemap texture

<span>
<img width = '300' src = 'https://git.ajou.ac.kr/rookims1996/webgl-tutorial/-/raw/master/Files/image/4_cubemap sampling.png'> 
<img width = '300' src = 'https://git.ajou.ac.kr/rookims1996/webgl-tutorial/-/raw/master/Files/image/5_cubemap texture.png'>
</span><br>
cubemap texture는 기존의 u, v좌표를 정해서 직접 mapping해줬던 다른 texture들과는 조금 다르게 방향vector와 물체를 감싸는 cube형태의 texture와의 상관관계를 이용해 물체의 texture를 mapping해준다. 이 때 cubemap은 2번째 사진과 6장의 image로 저장될 수 있다<br>
    
### skybox

<span>
<img width = '600' src = 'https://git.ajou.ac.kr/rookims1996/webgl-tutorial/-/raw/master/Files/image/6_cubemap rendering.jpg'>
</span><br>
skybox는 그래픽 내의 모든 물체를 감싸고 있는 가상의 cube에 texture를 입혀 배경처럼 느껴지게 하는 것이다. 이는 cubemap texture와 비슷한 성질을 가지고 있기 때문에 cubemap texture를 이용하면 skybox를 쉽게 구현할 수 있었다. 만약 cubemap texture에 있는 하늘 cubemap texture를 이용해 skybox를 만들게 된다면 위 사진과 같을 것이다. 이 때 skybox는 cubemap texture와 완전히 같은 개념이 아니므로 카메라가 이동하면서 생기는 문제라던가 depth test로 인해서 생기는 문제들을 해결할 필요가 있었다.<br>
     
### environment mapping

<span>
<img width = '300' src = 'https://git.ajou.ac.kr/rookims1996/webgl-tutorial/-/raw/master/Files/image/1_normal.png'>
<img width = '300' src = 'https://git.ajou.ac.kr/rookims1996/webgl-tutorial/-/raw/master/Files/image/2_reflect.png'>
</span><br>
cubemap texture는 입력받은 방향vector에 대응해서 texture를 입혀주는 방식이므로 기존에 넘겨줘야하는 normal vector와 다른 vector를 넘겨주면 물체가 cubemap texture의 다른 부분을 mapping할 수 있다. 이를 응용해서 기존의 mapping을 위한 normal vector 대신에 물체와 카메라의 위치를 고려해 반사, 굴절을 했을 때 생기게 될 방향vector를 구해서 skybox에 쓰인 cubemap texture에 mapping을 했다. 이 방법을 이용해 물체가 skybox를 반사, 굴절해 보여주는 효과를 낼 수 있었다.<br><br>

## 코드 제작 과정

주제를 먼저 정한 뒤에 페이지가 어떻게 구성될지를 먼저 정했다. 내가 이번 프로젝트에서 다룰 주제인 environment mapping을 공부해보니 이 주제의 핵심 내용은 cubemap texture, skybox, environment mapping의 구현이 중심이 된다는 것을 알 수 있었고, Tutorial의 기본흐름을 앞에서 언급한 내용들을 순서대로 하나씩 공부해 다음 내용을 이해할 수 있도록 만들어야겠다고 생각했고 이를 기본으로 html의 틀을 먼저 만들었다. 

html의 틀을 작성한 후에는 Tutorial을 진행하면서 알려주는 내용을 렌더링되고 있는 canvas를 이용해 직접 실험해볼 수 있도록 만들었다. 이때 직접 회전속도, skybox 여부 등의 Tutorial의 내용과 관련된 변수들을 조정할 수 있게 만들었다. 
    
각 canvas들은 Tutorial에서 다루는 내용들을 담고 있어야했기때문에 나 또한 WebGL1.0을 이용한 skybox, environment mapping을 구현했다. 이 때 사용하는 canvas가 2개였기 때문에 교수님이 제공해주신 기본코드를 바탕으로 WebGL context를 여러 개 받을 수 있도록 아래와 같이 함수들을 수정했다. 

```java
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
    // texture를 만들어서 texData에 넣는다.
	gl.skyboxTexture = loadCubemap(gl.context, texData);

    return testGLError(gl, "initialiseBuffers");
}

function initialiseShaders(gl) {
    // =================== cube shader ===================
    const cubeVS = `
        vertex shader
    `;
    const cubeFS = `
        fragment shader
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
        vertex shader
    `;
    const skyboxFS = `
        fragment shader
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
``` 

위 코드 뿐만 아니라 기존 코드의 여러 부분들에 대해서 context객체를 함수에서 직접 받을 수 있도록 변형해서 사용했다. 

그리고 environment mapping을 shader를 통해서 구현될 수 있도록 만들었다. 이 때 skybox를 생성하는 shader를 통해서 기본적인 cubemap texture의 내용을 학습할 수 있고, environment mapping이 이뤄지는 cube의 shader를 통해서 cubemap texture의 응용을 학습할 수 있다. 특이사항으로는 둘다 구현하는 도중에 회전은 적용하지만 이동을 적용하지 않기 위해서 기존에 있는 homogeneous coordinate를 구현하는 4차원 vector의 끝을 0으로 바꾸는 방법을 이용했다.
```java
    // skybox vertex shader
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

    // skybox fragment shader
    uniform samplerCube skyboxTex;

    varying highp vec3 texCoords;
    
    void main()
    {
        gl_FragColor = vec4(textureCube(skyboxTex, texCoords).rgb, 1.0) ;
    }

    // cube vertex shader
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

    // cube fragment shader
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
```

위와 같은 코드들을 이용해서 Tutorial의 canvas를 완성할 수 있었고, 위 코드를 뒷받침하고 주제에 필요한 내용들을 설명하면서 순차적으로 공부할 수 있도록 만들었다.

그리고 글의 윗 내용이 아직 공부가 덜 돼서 중간에 돌아가더라도 쉽게 돌아갈 수 있도록 목차와 목차로 돌아가기를 만들어 원하는 내용을 쉽게 찾을수 있도록 만들었다.
마지막으로 페이지를 완성하고 보니 만약 아예 모르는 사람이 이 페이지에 들어오게 됐을때 Tutorial을 따라가기 힘들 것이라는 생각이 들었다. 그래서 다른 강의를 통해서 공부를 하고 볼 수 있도록 시작단계에 Tutorial을 이해하기 위해서 필요한 기술들과 만약 해당 기술들을 모른다면 참고해서 공부할만한 링크들을 추가해줬다. 

또한 마무리 단계에서 이 Tutorial을 끝내고 나서 시도해볼만한 다음 주제를 제시해 environment mapping을 추가적으로 활용한 공부를 이어나갈 수 있도록 만들었다.

## Tutorial Page의 사용법

Tutorial에서 설명하는 내용들을 목차의 순서대로 읽어 내려가면서 공부한다. 또한 Tutorial의 과정에서 제공하는 코드를 활용해 자신의 실습을 해볼 수 있다.

그 과정 중간에 있는 canvas들과 옆의 기능셋을 이용해 cube나 카메라를 움직여 변화를 관찰하거나 skybox를 끄는 등의 상호작용을 할 수 있다. 이 상호작용들은 목차로 나눠놓은 해당 단락들과 연관된 상호작용을 넣어놨으므로, Tutorial을 진행하면서 어떤 원리가 실제로는 어떻게 적용되고 있는지 확인할 수 있다.
    

## 추가로 공부해서 보완할 수 있는 부분

### 굴절의 구현

굴절은 반사와 매우 비슷하지만 굴절율이라는 추가적인 변수를 더 고려해야한다. 이를 적절하게 구현을 해 반사와 함께 활용하게 된다면 창문과 같이 밖도 비치고 안도 비치는 사물을 구현할 수 있을 것이다. 

### shading의 활용

shading은 environment mapping과 마찬가지로 현실의 현상을 자연스럽게 그래픽 내에서 표현할 수 있도록 하는 기법이다. 그 중 shading은 빛과 그림자에 대한 기법이며, 이를 environment mapping과 함께 이용해 그래픽을 표현한다면 좀더 현실에 가깝게 물체를 표현할 수 있을 것이다. 

### 동적인 environment mapping

현재는 배경을 나타내는 skybox만을 고려해 environment mapping을 하고 있으므로 만약에 물체 옆에 또다른 물체가 지나간다면 이는 반사에 반영되지 않을 것이다. 하지만 현실에서는 거울 옆만 지나가더라도 내가 움직이는 대로 거울에 반영되는 것을 알 수 있다. 그러므로 이러한 변화하는 주변 상황들을 고려할 수 있는 environment mapping 방법을 이용한다면 좀더 현실에 가까운 반사, 굴절을 표현할 수 있을 것이다.

## 이미지 출처 및 참고링크
    
**참고링크** 

https://learnopengl.com/Advanced-OpenGL/Cubemaps<br>
https://webglfundamentals.org/webgl/lessons/webgl-cube-maps.html<br>
https://lifeisforu.tistory.com/375<br>
https://www.youtube.com/watch?v=77cmqAEcvJU<br>
https://www.youtube.com/watch?v=hGo0UAebWnk<br>
https://www.youtube.com/watch?v=NlhmZwIXZko<br>
https://www.youtube.com/watch?v=ISXcdfYmYUI<br>
https://www.youtube.com/watch?v=ilg1Jc4Q0Rk<br>
https://www.youtube.com/watch?v=uVDZton_TwU 

**참고코드** 

https://learnopengl.com/code_viewer_gh.php?code=src/4.advanced_opengl/6.2.cubemaps_environment_mapping/cubemaps_environment_mapping.cpp<br>
https://github.com/hwan-ajou/webgl-1.0<br>

**이미지 출처** 

4_cubemap sampling.png, 8_reflection.png, 9_refraction.png : https://learnopengl.com/Advanced-OpenGL/Cubemaps<br>
5_cubemap texture.png, 6_cubemap rendering.jpg : https://www.keithlantz.net/2011/10/rendering-a-skybox-using-a-cube-map-with-opengl-and-glsl/
