
        The LookAt Method for Camera Location and Orientation

This renderer adds one new method, lookAt(), to the Camera class.
The lookAt() method is another way (along with the viewTranslate()
and viewRotate() methods) to move the camera around in world space
and point it in any direction. The lookAt() method comes from the
OpenGL library. See
"https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/gluLookAt.xml"

The viewTranslate() and viewRotate() methods can be difficult to
work with. If you use viewTranslate() to place a camera at some
point in space and you want the camera to look at some distant
point, it can be tricky to compute the angles for viewRotate() so
that the camera is looking exactly at the far away point. The
lookAt() method solves this problem by encoding both the camera's
location and its "look at" point into a single function call.

void gluLookAt(GLdouble eyeX,    GLdouble eyeY,    GLdouble eyeZ,
               GLdouble centerX, GLdouble centerY, GLdouble centerZ,
               GLdouble upX,     GLdouble upY,     GLdouble upZ);

The (eyeX, eyeY, eyxZ) parameters determine the location of the camera.
The (centerX, centerY, centerZ) paramameters determine the point that
the camera is looking at.

Once the location and direction of the camera have been specified, there
is still one aspect of the camera that needs to be determined. When you
point your camera at an object, you still need to decide the orientation
of your camera. Two common orientations are "portrait" and "landscape".
In "portrait" orientation, the longer dimension of the camera is vertical.
You rotate your camera into "landscape" orientation when the camera's
longer dimension is horizontal.
