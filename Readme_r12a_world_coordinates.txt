
          World Coordinates, Camera Location and Orientation


This renderer modifies the Camera class in order to allow a camera to move
around in space and point in any direction.

Creating a moving camera involves a mathematical trick. We create a new
coordinate system, the world coordinate system, and place all our objects,
including the camera, into that coordinate system. Then we use a world-to-view
coordinate transformation to convert every vertex's coordinates from the world
coordinate system to the camera's view coordinate system.

In the previous renderers, the camera was fixed at the origin, looking down
the negative z-axis. With the camera at the origin, every vertex had its
coordinates measured in a natural way relative to the camera's location.
We will call coordinates measured relative to the camera "view coordinates"
(they are also called "eye coordinates"). In the previous renderer, we
used a model's modelMatrix to place the model in space using the camera's
view coordinate system (hence, the model-to-view coordinate transformation
stage in the rendering pipeline).

What we want to do in this renderer is remove the camera from the origin,
and call the coordinate system relative to the origin the "world coordinate
system". Then place all our geometric objects in the world coordinate space
(so every object is located by its coordinates relative to the origin). Then
we want to place a camera (with its view volume) somewhere in the world
coordinate system. Once the camera is in place, notice that every geometric
object can be located relative either to the camera or to the origin. What
we mean is that every vertex will have two sets of coordinates. Every vertex
v will have "world" coordinates (x_w, y_w, z_w) relative to the origin AND it
simultaneously has "view" coordinates (x_v, y_v, z_v) relative to the location
of the camera (and its view volume). What this renderer does is add a method
to the Camera class that implements a transformation T that converts vertex
coordinates from world-coordinates to view-coordinates
      T(x_w, y_w, z_w) = (x_v, y_v, z_v)
In addition, there is a new pipeline stage, World2View.java, that applies
this transformation to all the vertices in a scene.

Once the coordinates of a vertex are transformed from world coordinates to
the camera's view coordinates, the rest of the pipeline stages can work on
the vertex just as they did in the previous renderer.

The world-to-view transformation is implemented as a matrix, similar to the
model-to-world and view-to-camera transformations.



We need to explain how to compute the world-to-view transformation matrix.

The basic idea is that a camera's world-to-view matrix is the inverse matrix
of what would be the camera's model matrix, i.e., the model-to-world matrix
that would place and orient the camera object in the world coordinate space.

Explain why this works...
We need to prepend the camera's world-to-view matrix
onto every model's model-to-world matrix to give each model the additional
positioning determined by the world-to-view transformation. This additional
positioning happens "last", after each model has been positioned in world
coordinates, so it happens on the left of each model's model-to-matrix, i.e.,
  for (model : scene)
    for (vertex : model)
      vertex = (scene.camera.world-to-view) * (model.model-to-world) * vertex

Here is an example. Suppose we start with a camera located at the origin and
looking down the negative z-axis. If we rotate the camera 20 degree to the
right, then every object the camera is looking at effectively rotates 20
degree to the left relative to the camera. So the camera's view matrix
(rotate 20 degrees to the left) is the inverse of the camera's model matrix
(rotate 20 degrees to the right).

Similarly, if we start with a camera located at the origin and looking down
the negative z-axis and we move the camera back 5 units (in the positive
z-direction), then every object the camera is looking at effectively
translates 5 units in the negative z-direction relative to the camera. So the
camera's view matrix (translate -5 units in the z-direction) is the inverse
of the camera's model matrix (translate 5 units in the z-direction).

If the camera's current model matrix is A (so A^(-1) is the camera's current
world-to-view matrix) and we want to move the camera using transformation
matrix B, then the rule for model matrices is that we get the new model matrix
by multiplying the transformation matrix on the right of the current model
matrix. So the camera's new model matrix is A*B. The camera's new world-to-view
matrix is the inverse, (A*B)^(-1) = B^(-1) * A^(-1). So we compute the camera's
new world-to-view matrix by multiplying the inverse of the transformation matrix
on the left of the current world-to-view matrix.







This renderer has one new file in the pipeline package,
   World2View.java.
The new pipeline stage gets added to
   Renderer.java.
What was the Model2View.java pipeline stage gets renamed Model2World.java.
There are changes to the client programs and the following two files.
   Camera.java
   Renderer.java



Our pipeline has the following seven stages.

       v_0 ... v_n     A Model's list of (homogeneous) Vertex objects
          \   /
           \ /
            |
            | model coordinates (of v_0 ... v_n)
            |
        +-------+
        |       |
        |   P1  |    Model2World (matrix) transformation (of the vertices)
        |       |
        +-------+
            |
            | world coordinates (of v_0 ... v_n)
            |
        +-------+
        |       |
        |   P2  |    World2View (matrix) transformation (of the vertices)
        |       |
        +-------+
            |
            | view coordinates (of v_0 ... v_n) relative to an arbitrary view volume
            |
        +-------+
        |       |
        |   P3  |    View2Camera (normalization matrix) transformation (of the vertices)
        |       |
        +-------+
            |
            | camera coordinates (of v_0 ... v_n) relative to the standard view volume
            |
           / \
          /   \
         /     \
        |   P4  |   Near Clipping (of each line segment or point)
         \     /
          \   /
           \ /
            |
            | camera coordinates (of the near-clipped v_0 ... v_n)
            |
        +-------+
        |       |
        |   P5  |    Projection transformation (of the vertices)
        |       |
        +-------+
            |
            | image plane coordinates (of v_0 ... v_n)
            |
           / \
          /   \
         /     \
        |   P6  |   Clipping (of each line segment or point)
         \     /
          \   /
           \ /
            |
            | image plane coordinates (of the clipped vertices)
            |
        +-------+
        |       |
        |   P7a |    Viewport transformation (of the clipped vertices)
        |       |
        +-------+
            |
            | pixel-plane coordinates (of the clipped vertices)
            |
           / \
          /   \
         /     \
        |   P7  |   Rasterization & anti-aliasing (of each clipped line segment)
         \     /
          \   /
           \ /
            |
            |  shaded pixels (for each clipped, anti-aliased line segment)
            |
           \|/
    FrameBuffer.ViewPort
