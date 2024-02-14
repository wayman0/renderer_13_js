
     Hierarchical (Nested) Models


This renderer allows us to define and use "hierarchical models".
A hierarchical model is similar to a hierarchical scene. In a
hierarchical model there are sub-models that are formed into
groups and we can move each group of sub-models as a single
entity within the whole model while we can also move each
individual sub-model within a group.

A good example of a nested model is a robot arm made up of an upper-arm,
lower-arm, hand, and five fingers. When you rotate the arm at its shoulder,
all the arm's parts should move together. But when you rotate the arm at
its elbow, only the group made of the lower-arm, hand and fingers should 
move together. When you rotate the arm at its wrist, the group made of the 
hand and fingers should move together. And each finger should be able to 
move by itself. Notice that the lower-arm, hand, and fingers form a group,
and the hand and fingers are a sub-group of the lower-arm, hand, fingers
group.

A robot arm could be implemented as a group of individual models within a
hierarchical scene, but that may not be ideal. Unlike a table and chairs 
group of models, which is a group of very separate models, a robot arm is 
usually one model that is made up of sub-models. It will usually be easier
to work with a robot arm as a single "hierarchical model" than as a group of
individual models within a "hierarchical scene". But, for example, if we wanted
the hand and its fingers to detach from the rest of the arm and crawl across
the scene, then we may want to model the arm using a combination of "hierarchical 
model" and "hierarchical scene".

This renderer turns a Model into tree data structure. The tree structure of
each Model sits within the Scene's tree structure of Positions. Each Position
has a sub-tree of Positions (part of the hierarchical scene) and the Model in
each Position is also a root of another sub-tree (a hierarchical model). When
the renderer renders a Scene, it will do a pre-order, depth-first-traversal of
this entire tree data structure.


Changes
=======

There are no new files in the renderer. The only modified files are
   Model.java,
   Pipeline.java.
There are three new (hierarchical) models,
   SierpinskiTriangle.java,
   SierpinskiSponge.java,
   MengerSponge.java.

There are several new client programs that make use
of the nested model feature.


Pipeline
========

Our pipeline for rendering a Scene is unchanged from the previous
pipeline. The only change to the renderer is that it now has to traverse
all the nested Position nodes in each model (in addition to traversing
all the nested Position nodes in the Scene).
