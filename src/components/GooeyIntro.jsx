import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapConfig';
import { ScrollTrigger, ScrollToPlugin } from '../utils/gsapConfig';
import './GooeyIntro.css';

const GooeyIntro = ({ onIntroComplete, children }) => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const scrollMsgRef = useRef(null);
  const scrollArrowRef = useRef(null);
  const pageRef = useRef(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
  const params = {
    scrollProgress: 0,
    colWidth: 0.7,
    speed: 0.2,
    scale: 0.25,
    seed: 0.231,
    color: [1.0, 0.431, 0.369], // #FF6E5E converted to RGB (0-1)
    pageColor: "#fff"
  };

  let uniforms;
  let gl;

  // Vertex shader
  const vertexShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    attribute vec2 a_position;
    void main() {
      vUv = a_position;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader
  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform float u_scroll_progr;
    uniform float u_col_width;
    uniform float u_seed;
    uniform float u_scale;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_opacity;
    uniform vec3 u_color;

    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1;x0.x>x0.y?i1=vec2(1.0,0.0):i1=vec2(0.0,1.0);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
      i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
      m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);vec3 g;
      g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);}
    float get_l(vec2 v){return 1.-clamp(0.,1.,length(v));}
    float rand(float n){return fract(sin(n)*43758.5453123);}
    void main(){
      float scale=.001*u_scale;float speed=.001*u_speed;vec2 uv=vUv;uv.x*=(scale*u_resolution.x);
      vec2 noise_uv=uv;noise_uv*=5.;noise_uv.y*=.25*scale*u_resolution.y;noise_uv+=vec2(0.,u_time*1.5*speed);
      float shape=0.;shape+=snoise(noise_uv);shape=clamp(.5+.5*shape,0.,1.);shape*=pow(.5*uv.y+.7+pow(u_scroll_progr,2.)+(.4*u_scroll_progr*(1.-pow(vUv.x-.2,2.))),10.);
      shape=clamp(shape,0.,1.);float dots=0.;float bars=0.;float light=0.;const int num_col=9;for(int i=0;i<num_col;i++){vec2 col_uv=vUv;
      float start_time_offset=rand(100.*(float(i)+u_seed));float c_t=fract(u_time*speed+start_time_offset);float drop_time=.2+.6*rand(10.*(float(i)+u_seed));
      float before_drop_normal=c_t/drop_time;float before_drop_t=pow(before_drop_normal,.4)*drop_time;float after_drop_normal=max(0.,c_t-drop_time)/(1.-drop_time);
      float after_drop_t_dot=3.*pow(after_drop_normal,2.)*(1.-drop_time);float after_drop_t_bar=pow(after_drop_normal,2.)*(drop_time);
      float eased_drop_t=step(c_t,drop_time)*before_drop_t;eased_drop_t+=step(drop_time,c_t)*(drop_time+after_drop_t_dot);col_uv.y+=(1.+3.*rand(15.*float(i)))*u_scroll_progr;
      col_uv.x*=(u_resolution.x/u_resolution.y);col_uv*=(7.*scale*u_resolution.y);col_uv.x+=(u_col_width*(.5*float(num_col)-float(i)));vec2 dot_uv=col_uv;dot_uv.y+=4.*(eased_drop_t-.5);
      float dot=get_l(dot_uv);dot=pow(dot,4.);float drop_grow=step(c_t,drop_time)*pow(before_drop_normal,.4);drop_grow+=step(drop_time,c_t)*mix(1.,.8,clamp(7.*after_drop_normal,0.,1.));
      dot*=drop_grow;dot*=step(.5,drop_time);dots+=dot;vec2 bar_uv=col_uv;bar_uv.y+=step(c_t,drop_time)*4.*(before_drop_t-.5);bar_uv.y+=step(drop_time,c_t)*4.*(drop_time-after_drop_t_bar-.5);
      float bar=smoothstep(-.5,0.,bar_uv.x)*(1.-smoothstep(0.,.5,bar_uv.x));bar=pow(bar,4.);light+=bar*smoothstep(.0,.1,-bar_uv.x);float bar_mask=smoothstep(-.2,.2,bar_uv.y);bar*=bar_mask;bars+=bar;}
      shape+=bars;shape=clamp(shape,0.,1.);shape+=dots;float gooey=smoothstep(.48,.5,shape);gooey-=.1*smoothstep(.5,.6,shape);vec3 color=u_color;color.r+=.2*(1.-vUv.y)*(1.-u_scroll_progr);
      color*=gooey;color=mix(color,vec3(1.),max(0.,1.-2.*vUv.y)*light*smoothstep(.1,.7,snoise(.5*uv))*(smoothstep(.49,.6,shape)-smoothstep(.6,1.,shape)));
      gl_FragColor=vec4(color,gooey);}
  `;

  const createShader = (gl, sourceCode, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      return null;
    }
    
    return shader;
  };

  const getUniforms = (program) => {
    let uniforms = {};
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  };

  const initShader = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return null;
    }
    
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }
    
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Shader creation failed');
      return null;
    }
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    
    uniforms = getUniforms(shaderProgram);
    
    const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    gl.useProgram(shaderProgram);
    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    gl.uniform1f(uniforms.u_col_width, params.colWidth);
    gl.uniform1f(uniforms.u_speed, params.speed);
    gl.uniform1f(uniforms.u_scale, params.scale);
    gl.uniform1f(uniforms.u_seed, params.seed);
    gl.uniform3f(uniforms.u_color, params.color[0], params.color[1], params.color[2]);
    
    return gl;
  };

  const render = () => {
    if (!gl || !uniforms || !canvasRef.current) return;
    
    const currentTime = performance.now();
    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform1f(uniforms.u_scroll_progr, params.scrollProgress);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  };

  const resizeCanvas = () => {
    if (!canvasRef.current || !gl || !uniforms) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
  };

  useEffect(() => {
    // Lock scroll initially
    document.body.classList.add("lock-scroll");
    document.body.style.background = "linear-gradient(90deg, rgba(255, 110, 94, 1) 0%, rgba(243, 100, 162, 1) 50%, rgba(155, 76, 251, 1) 100%)";
    document.body.style.backgroundSize = "100% 100%";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    // Initialize WebGL with retry mechanism
    const initWebGL = () => {
      if (!canvasRef.current) {
        console.log('Canvas not ready, retrying...');
        setTimeout(initWebGL, 50);
        return;
      }
      
      gl = initShader();
      if (gl) {
        setWebglReady(true);
        resizeCanvas();
        render();
        console.log('WebGL initialized successfully');
      } else {
        console.log('WebGL initialization failed');
      }
    };

    // Start initialization process
    initWebGL();
    
    // Manual scroll handler for better control
    let scrollY = 0;
    const maxScroll = window.innerHeight; // Height of the intro section
    
    const handleScroll = (e) => {
      if (introComplete) return;
      
      // Calculate scroll progress
      scrollY += e.deltaY * 0.5; // Reduce scroll sensitivity
      scrollY = Math.max(0, Math.min(scrollY, maxScroll));
      
      updateProgress(scrollY);
    };

    // Touch/swipe handler for mobile
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTouchY = 0;
    let touchMoved = false;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchStartTime = Date.now();
      touchMoved = false;
    };
    
    const handleTouchMove = (e) => {
      if (introComplete) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY - touchY; // Positive = swipe up
      
      // Only respond to significant vertical swipes
      if (Math.abs(deltaY) > 5) {
        touchMoved = true;
        
        // Much more sensitive for mobile - one good swipe should complete most of the animation
        scrollY += deltaY * 1.2; // Increased sensitivity
        scrollY = Math.max(0, Math.min(scrollY, maxScroll));
        
        updateProgress(scrollY);
        
        // Update last touch position for continuous tracking
        lastTouchY = touchY;
      }
    };
    
    const handleTouchEnd = (e) => {
      if (!touchMoved) return;
      
      const touchEndTime = Date.now();
      const swipeDuration = touchEndTime - touchStartTime;
      const totalSwipeDistance = touchStartY - lastTouchY;
      
      // Add momentum for natural feel
      if (swipeDuration < 500 && Math.abs(totalSwipeDistance) > 30) {
        // Calculate momentum based on swipe speed and distance
        const swipeSpeed = Math.abs(totalSwipeDistance) / swipeDuration;
        const momentum = totalSwipeDistance * swipeSpeed * 0.8;
        
        scrollY += momentum;
        scrollY = Math.max(0, Math.min(scrollY, maxScroll));
        updateProgress(scrollY);
      }
    };
    
    // Common function to update progress and animations
    const updateProgress = (currentScrollY) => {
      // Mobile-optimized progress calculation
      const isMobile = window.innerWidth <= 768;
      let progress = currentScrollY / maxScroll;
      
      // On mobile, make the progress feel more natural
      if (isMobile) {
        // Apply easing curve for better mobile experience
        progress = Math.pow(progress, 0.8); // Makes early progress faster
      }
      
      params.scrollProgress = progress;
      
      // Update animations based on scroll
      if (progress > 0.3 && scrollArrowRef.current) {
        gsap.to(scrollArrowRef.current, { y: 50, opacity: 0, duration: 0.2 });
      }
      if (progress > 0.5 && scrollMsgRef.current) {
        gsap.to(scrollMsgRef.current, { opacity: 0, duration: 0.3 });
      }
      if (progress > 0.7 && contentRef.current) {
        gsap.to(contentRef.current, { opacity: 1, duration: 0.3 });
      }
      
      // Start smooth transition to website content
      if (progress > 0.8 && !isTransitioning) {
        setIsTransitioning(true);
        const fadeProgress = (progress - 0.8) / 0.2;
        gsap.to('.intro-overlay', { 
          opacity: 1 - fadeProgress, 
          duration: 0.1,
          ease: "power2.out"
        });
        
        // Start revealing website content
        gsap.to('.website-content', { 
          opacity: fadeProgress, 
          duration: 0.1,
          ease: "power2.out"
        });
      }
      
      // Complete intro when scroll reaches end
      if (progress >= 1) {
        // Smooth transition to website
        gsap.to('.intro-overlay', { 
          opacity: 0, 
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            // Enable website content interaction
            gsap.set('.website-content', { 
              opacity: 1, 
              pointerEvents: 'auto' 
            });
            
            // Smooth scroll to top of website content
            gsap.to(window, {
              scrollTo: { y: 0 },
              duration: 1.2,
              ease: "power2.out"
            });
            
            document.body.classList.remove("lock-scroll");
            setIntroComplete(true);
            if (onIntroComplete) {
              onIntroComplete();
            }
            window.removeEventListener("wheel", handleScroll);
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
          }
        });
      }
    };

    // Set initial page opacity safely
    if (pageRef.current) {
      gsap.set(pageRef.current, { opacity: 1 });
    }

    // Set up event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("wheel", handleScroll, { passive: false });
    
    // Add touch events for mobile
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", handleScroll);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onIntroComplete, introComplete]);

  if (introComplete) {
    return children;
  }

  return (
    <div id="intro">
      {/* Intro overlay that fades out smoothly */}
      <div className="intro-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: params.pageColor,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1
      }}>
        <div className="page" ref={pageRef}>
          <div className="scroll-msg" ref={scrollMsgRef}>
            
            <div style={{ color: '#333', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>scroll me</div>
            <div className="arrow-animated-wrapper" ref={scrollArrowRef}>
              <div className="arrow-animated" style={{ color: '#333' }}>&darr;</div>
            </div>
                      <div style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8, color: '#666' }}>
            {window.innerWidth <= 768 ? 'Swipe up to continue' : 'Use mouse wheel or trackpad to scroll'}
          </div>
          {window.innerWidth <= 768 && (
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              opacity: 0.6, 
              color: '#999',
              textAlign: 'center'
            }}>
              One good swipe should do it! ✨
            </div>
          )}
          </div>
        </div>
        
        {/* WebGL Canvas with fallback */}
        <canvas id="gooey-overlay" ref={canvasRef} />
        
        {/* Fallback if WebGL fails */}
        {!webglReady && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div>🎨 WebGL Effect Loading...</div>
              <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
                If this persists, try refreshing the page
              </div>
            </div>
          </div>
        )}
        

        
      </div>
      
      {/* Website content that will be revealed */}
      <div className="website-content" style={{
        position: 'relative',
        zIndex: 1,
        opacity: 0,
        pointerEvents: 'none'
      }}>
        {children}
      </div>
      

    </div>
  );
};

export default GooeyIntro;
