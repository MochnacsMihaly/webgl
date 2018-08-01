precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sampler;
uniform sampler2D sampler2;

void main()
{
  gl_FragColor = texture2D(sampler, fragTexCoord);
}