# sapper-template

This is a fork from the official [Sapper template](https://github.com/sveltejs/sapper-template), with aims of being a feature-complete starter app that prioritizes developer experience, performance, and costs to maintain/deploy.

What is it? A single express app that does not depend on any 3rd party services for auth, image handling, data storage (except for PostgresDB)


## Getting started

As of now, getting started is mostly the same [Sapper template](https://github.com/sveltejs/sapper-template) with these additions:

- You'll need a running PostgresDB and set the config in /config.

## Architectural Decisions

### Why Sapper? 

I choose Sapper for Svelte + it's novel approach to co-locating backend code with frontend, which IMO offers:
 1. all of the productivity gains of server-rendered traditional backends (Rails, Django) by co-locating frontend and backend source code
 2. by co-locating backend code with frontend, it's trivial to implement route-specific custom REST endpoints. In effect, this dramatically decreases the benefits of GraphQL, which is in my experience is a major effort to implement and maintain due to complex, fragile tooling, complex caching that is near impossible to cache at the edges, and the need to being a generic API. GraphQL is still the best choice for an API with multiple clients, but it's overkill for backends made for one consumer/client.
 3. easier management of image handling

 
### Why Sass?

Stylus or modern CSS would be preferred, but Sapper and IDEs aren't ready. 

Stylus:
- svelte-check does not yet support stylus
- prettier does not seem to support stylus yet
  
Modern CSS via PostCSS:
- IDEs don't understand it


### Why not PUG for HTML templates?

I'm a big fan of PUG, but
- svelte-check fails for Svelte mixins (aka +if and +each): https://github.com/sveltejs/svelte-preprocess/issues/207
- IDE support is incomplete with Svelte mixins, b/c they use strings which are not understood by IDE to be JS


### Image Handling

Decisions:
- Source images are stored generically: bins saved to a flat file bucket and metadata stored in an images db table. This way images can easily have many-to-many relationships with other db records.
- Frontend routes that display images should implement a seperate image fetching route for each image use-case. For example, you could have an avatar.jpg.json that returns a 50px*50px cropped and resized jpeg image.
- Similarly, frontend routes that support image uploads should implement a seperate image saving route for each image saving use-case. For example, you could have an avatar.jpg.json route that accepts image POSTs, optimizes the image, saves to file storage, creates an image db record, then creates a relationship between the image and the user that the avatar is for.
- Image processing is done using SharpJS for performance and developer experience (see note below)


## Imageflow? Pass.

I strongly considered imageflow_server as a microservice, but realized the complexity involved in adding a microservice overkill and actually less good than using ad-hoc image routes c/o Sapper + SharpJs.

Pros of imageflow_server:
- can generically fetch any image
- low-config management of cache

Cons
- Takes significant manual effort to setup
- Caching strategy is generic and in many cases non-ideal
- Image URL strategy is harder to reason with and manage vs co-locating the image URL with the page that accesses it c/o Sapper

Once I decided on handling image optimization in Sapper, I had to decide SharpJS vs. ImageFlow-node. I choose SharpJS b/c it's significantly higher performance, more mature, and easier to use/setup.
