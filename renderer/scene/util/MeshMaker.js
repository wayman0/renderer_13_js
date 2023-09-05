/*
 * Renderer 10. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@link Model} that implements {@code MeshMaker} can
   rebuild its geometric mesh with different values for
   the number of lines of latitude and longitude while
   keeping all the other model parameters unchanged.
*/

export default class MeshMaker
{
    getHorzCount();

    getVertCount();

    remake(n, k);
}