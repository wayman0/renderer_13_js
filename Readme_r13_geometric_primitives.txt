
          Geometric Primitives


This renderer adds the idea of a "geometric primitive".

A "geometric primitive" is a small piece of geometry that
we can use to build up larger, more complicated pieces of
geometry. So far our renderers have used a single primitive
to build geometry. Every model has been build out of just
line segments. In this renderer we will define several new
geometric primitives. The goal of the new primitives is not
to be able to define new kinds of models. The goal of the new
primitives is to make our models a bit more memory efficient.

https://www3.ntu.edu.sg/home/ehchua/programming/opengl/CG_Introduction.html#zz-3.8
http://math.hws.edu/graphicsbook/c3/s1.html#gl1geom.1.1


Consider this simple model of a vertex with three line segments
coming out of it (a hub with three spokes).

            v1 +           + v2
                \         /
                 \       /
                  \     /
                   \   /
                    \ /
                     + v0
                     |
                     |
                     |
                     |
                     +
                     v3

We can represent this with the following code, which creates
a Model object with references to four Vertex objects and three
LineSegment objects holding a total of six integers.

      Model model = new Model(); // empty model
      model.addVertex(v0, v1, v2, v3);
      model.addPrimitive(new LineSegment(0, 1),
                         new LineSegment(0, 2),
                         new LineSegment(0, 3));

Notice that the index 0 must be stored in three LineSegment objects.

One of our new primitives is LineFan and it is designed specifically
for geometry like this. A LineFan primitive stores a sequence of indices
where the first index represents a central vertex and all the other
indices represent an endpoint of a line segment emanating from the
central vertex.

Using a LineFan primitive we can define the above model using four
Vertex objects and just one LineFan object holding just four integers.

      Model model = new Model(); // empty model
      model.addVertex(v0, v1, v2, v3);
      model.addPrimitive(new LineFan(0, 1, 2, 3));

This model is slightly more efficient in its use of memory. By choosing
primitives carefully, we can save a fair amount of memory space. But in
a modern computer system, memory is cheap and plentiful. So why use
primitives? In a GPU based renderer, the saved memory space turns into
saved communication time when a model's data needs to be sent from the
CPU's memory to the GPU's memory. And communication between CPU memory
and GPU memory is still a bottleneck in modern computer systems, so
using higher order primitives speed up rendering by decreasing
communication time.


This renderer defines seven geometric primitives, two zero-dimensional
primitives and five one-dimensional primitives.
   Point
   Points
   LineSegment
   Lines
   LineStrip
   LineLoop
   LineFan

The two zero-dimensional primitives represent points that are not connected
together by line segments. These primitives can be used to represent
"point clouds".
https://en.wikipedia.org/wiki/Point_cloud

The five one-dimensional primitives all represent different kinds of lines.
A LineSegment represents a single line segment and Lines represents a
collection of (possibly) disconnected line segments.

LineStrip represents a collection of line segments connected to each other
"end to end" (sometimes called a polyline or a polygonal chain).
https://en.wikipedia.org/wiki/Polygonal_chain

A LineLoop is a line strip that begins and ends at the same point. It is
also called a closed line strip (or closed polygonal chain).

A LineFan, as we saw above, represents a central point with line segments
emanating (fanning out) from it.


While these primitives make it more efficient to represent geometry in
computer memory, they make clipping difficult. The renderer does not
even try to clip these primitives. Instead, the renderer has a stage
called "primitive assembly" that converts each "higher order" primitive
into a list of individual LineSegment primitives. For example, the three
spoke LineFan we showed above would be converted by the primitive assembly
stage into the earlier (less efficient, but easier to clip) model with
three LineSegment primitives.

The primitive assembly stage is just after the projection stage, which is
the last of the "vertex transformation" stages. The vertex transformation
stages transform vertices without needing to know anything about how any
vertex is connected to any other vertex. The clipping stage is the first
stage that needs to know which pairs vertices are connected to each other
into line segments. The clipping stage works best when it is given just
LineSegment primitives.


Here is an example of why the "higher order" primitives need the new
primitive assembly pipeline stage. The key idea is that it would be very
difficult to clip any other primitive than just a single line segment. For
example, consider a line loop primitive that defines a square and suppose
it extends out of the view rectangle like this.

                        v0
                        /\
                       /  \
                      /    \
                     /      \
                    /        \
                   /          \
              |   /            \   |
           ---+--/--------------\--+---- y = 1
              | /                \ |
              |/                  \|
              /                    \
             /|                    |\
         v3 / |                    | \ v1
            \ |                    | /
             \|                    |/
              \                    /
              |\                  /|
              | \                / |
              |  \              /  |
              |   \            /   |
              |    \          /    |
              |     \        /     |
              |      \      /      |
              |       \    /       |
              |        \  /        |
              |         \/         |
              |         v2         |
           ---+--------------------+---- y = -1
              |                    |
            x = -1               x = 1

Notice that this single, connected primitive clips into three
disconnected pieces, two pieces that are line segments and one
piece that is a (two part) line strip. Instead of trying to make
the clipping algorithm figure out that this LineLoop primitive
clips into two LineSegment primitives and a LineStrip primitive,
we will instead have the primitive assembly stage convert the
LineLoop primitive into a list of four LineSegment primitives
and then give the LineSegment primitives to the clipping algorithm
one LineSegment primitive at a time.



This renderer creates a new package, scene.primitives, and puts
several new files in the scene.primitives package
   Primitive.java,
   LineStrip.java,
   LineLoop.java,
   LineFan.java,
   Lines.java,
   Point.java,
   Points.java.
The LineSegment.java class is modified to extend Primitive and is
placed in the scene.primitives package. The Model class is modified
to contain a list of Primitives (instead of a list of LineSegments).
Several new pipeline stages
   PrimitiveAssembly.java,
   Clip.java,
   ClipPoints.java,
   Rasterize.java,
   RasterizePoints.java,
are added to the pipeline package.

There is a new package of models, models_P, where all of our models
are re-implemented to take advantage of the new higher order primitives.




Our pipeline has the following eight stages.

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
        |   P4  |   Primitive assembly (of each primitive into line segments or points)
         \     /
          \   /
           \ /
            |
            | list of line segments and points (in image plane coordinates)
            |
           / \
          /   \
         /     \
        |   P5  |   Near Clipping (of each line segment or point)
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
        |   P7  |   Clipping (of each line segment or point)
         \     /
          \   /
           \ /
            |
            | image plane coordinates (of the clipped vertices)
            |
        +-------+
        |       |
        |   P8a |    Viewport transformation (of the clipped vertices)
        |       |
        +-------+
            |
            | pixel-plane coordinates (of the clipped vertices)
            |
           / \
          /   \
         /     \
        |   P8  |   Rasterization & anti-aliasing (of each clipped line segment)
         \     /
          \   /
           \ /
            |
            |  shaded pixels (for each clipped, anti-aliased line segment)
            |
           \|/
    FrameBuffer.ViewPort
