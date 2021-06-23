# CG WebGL Final Project

**WebGL1.0 Environment Mapping Tutorial** 

<div style="text-align: right">소프트웨어학과 201520854 김성건</div> 

---
1. **주제 및 선정 동기** 

    **주제 : environment mapping** 
    
     environment mapping은 빛의 반사나 굴절로 인해서 주변환경이 현실의 물체에 비치는 것을 컴퓨터 그래픽으로 구현하기 위해서 사용하는 texture를 활용한 기법이다. 기존의 그래픽 내 cube는 주변의 물체들이 비추지 않기 때문에 어색하게 보이지만 environment mapping을 활용해 주변 환경을 texture로 이용함으로써 cube과 자연스럽게 주변을 비추는 것을 구현할 수 있다. 

    **선정동기** 

     수업을 통해서 shading을 배우면서 빛과 물체의 상호작용에 대해서 배울 수 있었다. 하지만 빛을 잘 반사시킨다는 것은 다르게 생각하면 거울처럼 다른 물체도 비춰서 잘 보일 것이라는 것을 의미했다. 하지만 수업의 내용만으로는 외부 환경과 물체와의 상호작용이 다뤄지지 않았기 때문에 궁금증이 생겨 교수님께 관련 질문을 했다. 이를 통해서 그래픽 내의 물체가 주변 환경과 상호작용하는 방식 중 흔하게 사용되는 것이 environment mapping이라는 것을 알 수 있었고, 이후에 개인적으로 조사해보니 공부를 하면 내가 충분히 설명을 할 수 있는 주제라고 생각했기 때문에 이를 주제로 선정했다.

2. **skybox를 이용한 environment mapping의 구현** 

    **cubemap texture** 

     cubemap texture는 기존의 u, v좌표를 정해서 직접 mapping해줬던 다른 texture들과는 조금 다르게 방향vector와 물체를 감싸는 cube형태의 texture와의 상관관계를 이용해 물체의 texture를 mapping해준다. 
    
    **skybox** 
    
     skybox는 그래픽 내의 모든 물체를 감싸고 있는 가상의 cube에 texture를 입혀 배경처럼 느껴지게 하는 것이다. 이는 cubemap texture와 비슷한 성질을 가지고 있기 때문에 cubemap texture를 이용하면 skybox를 쉽게 구현할 수 있었다. cubemap texture와 완전히 같은 개념이 아니므로 카메라가 이동하면서 생기는 문제라던가 depth test로 인해서 생기는 문제들을 해결할 필요가 있었다. 
     
    **environment mapping** 

     cubemap texture는 입력받은 방향vector에 대응해서 texture를 입혀주는 방식이므로 기존에 넘겨줘야하는 normal vector와 다른 vector를 넘겨주면 물체가 cubemap texture의 다른 부분을 mapping할 수 있다. 이를 응용해서 기존의 mapping을 위한 normal vector 대신에 물체와 카메라의 위치를 고려해 반사, 굴절을 했을 때 생기게 될 방향vector를 구해서 skybox에 쓰인 cubemap texture에 mapping을 했다. 이 방법을 이용해 물체가 skybox를 반사, 굴절해 보여주는 효과를 낼 수 있었다.

3. **추가로 공부해서 보완할 수 있는 부분** 

    **굴절의 구현** 

     굴절은 반사와 매우 비슷하지만 굴절율이라는 추가적인 변수를 더 고려해야한다. 이를 적절하게 구현을 해 반사와 함께 활용하게 된다면 창문과 같이 밖도 비치고 안도 비치는 사물을 구현할 수 있을 것이다. 

    **shading의 활용** 

     shading은 environment mapping과 마찬가지로 현실의 현상을 자연스럽게 그래픽 내에서 표현할 수 있도록 하는 기법이다. 그 중 shading은 빛과 그림자에 대한 기법이며, 이를 environment mapping과 함께 이용해 그래픽을 표현한다면 좀더 현실에 가깝게 물체를 표현할 수 있을 것이다. 

    **동적인 environment mapping** 

     현재는 배경을 나타내는 skybox만을 고려해 environment mapping을 하고 있으므로 만약에 물체 옆에 또다른 물체가 지나간다면 이는 반사에 반영되지 않을 것이다. 하지만 현실에서는 거울 옆만 지나가더라도 내가 움직이는 대로 거울에 반영되는 것을 알 수 있다. 그러므로 이러한 변화하는 주변 상황들을 고려할 수 있는 environment mapping 방법을 이용한다면 좀더 현실에 가까운 반사, 굴절을 표현할 수 있을 것이다.

4. **이미지 출처 및 참고링크** 
    
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
