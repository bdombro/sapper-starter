import { PrismaClient, UserRole } from '@prisma/client'

const testHash = '9b39911c178b3f399b5a8b4b2a57aee3f7c92de94ebadee6413e79ff977684dacb2542c1ebd631f824987bf7ae0ccf1212e0aa013b60b0efdbf5fff9737ff89c' // CoolPassword9

const prisma = new PrismaClient()

main().finally(() => prisma.$disconnect())

async function main() {
  let postWithAuthor

  postWithAuthor = await prisma.user.create({
    data: {
      givenName: 'Admin',
      surname: 'Foo',
      email: 'admin@example.com',
      roles: [UserRole.ADMIN],
      password: testHash,
      posts: {
        create: [
          {
            title: "What is Sapper??",
            slug: "what-is-sapper",
            likes: 0,
            html: `
              <p>ddddddddFirst, you have to know what <a href='https://svelte.dev'>Svelte</a> is. Svelte is a UI framework with a bold new idea: rather than providing a library that you write code with (like React or Vue, for example), it's a compiler that turns your components into highly optimized vanilla JavaScript. If you haven't already read the <a href='https://svelte.dev/blog/frameworks-without-the-framework'>introductory blog post</a>, you should!</p>
        
              <p>Sapper is a Next.js-style framework (<a href='blog/how-is-sapper-different-from-next'>more on that here</a>) built around Svelte. It makes it embarrassingly easy to create extremely high performance web apps. Out of the box, you get:</p>
        
              <ul>
                <li>Code-splitting, dynamic imports and hot module replacement, powered by webpack</li>
                <li>Server-side rendering (SSR) with client-side hydration</li>
                <li>Service worker for offline support, and all the PWA bells and whistles</li>
                <li>The nicest development experience you've ever had, or your money back</li>
              </ul>
        
              <p>It's implemented as Express middleware. Everything is set up and waiting for you to get started, but you keep complete control over the server, service worker, webpack config and everything else, so it's as flexible as you need it to be.</p>
            `.replace(/  *</g, '<'),
          },
        ],
      },
    },
  })
  console.log('added post with admin author:\n', postWithAuthor)

  postWithAuthor = await prisma.user.create({
    data: {
      givenName: 'Editor',
      surname: 'Foo',
      email: 'editor@example.com',
      roles: [UserRole.EDITOR],
      password: testHash,
      posts: {
        create: [
          {
            title: "How to use Sapper",
            slug: "how-to-use-sapper",
            likes: 0,
            html: `
              <h2>Step one</h2>
              <p>Create a new project, using <a href='https://github.com/Rich-Harris/degit'>degit</a>:</p>
        
              <pre><code>npx degit "sveltejs/sapper-template#rollup" my-app
              cd my-app
              npm install # or yarn!
              npm run dev
              </code></pre>
        
              <h2>Step two</h2>
              <p>Go to <a href='http://localhost:3000'>localhost:3000</a>. Open <code>my-app</code> in your editor. Edit the files in the <code>src/routes</code> directory or add new ones.</p>
        
              <h2>Step three</h2>
              <p>...</p>
        
              <h2>Step four</h2>
              <p>Resist overdone joke formats.</p>
            `.replace(/  *</g, '<'),
          },
        ],
      },
    },
  })
  console.log('added post with editor author:\n', postWithAuthor)

  postWithAuthor = await prisma.user.create({
    data: {
      givenName: 'Author',
      surname: 'Foo',
      email: 'author@example.com',
      roles: [UserRole.AUTHOR],
      password: testHash,
      posts: {
        create: [
          {
            title: "Why the name?",
            slug: "why-the-name",
            likes: 0,
            html: `
              <p>In war, the soldiers who build bridges, repair roads, clear minefields and conduct demolitions — all under combat conditions — are known as <em>sappers</em>.</p>
        
              <p>For web developers, the stakes are generally lower than those for combat engineers. But we face our own hostile environment: underpowered devices, poor network connections, and the complexity inherent in front-end engineering. Sapper, which is short for <strong>S</strong>velte <strong>app</strong> mak<strong>er</strong>, is your courageous and dutiful ally.</p>
            `.replace(/  *</g, '<'),
          },
          {
            title: "How is Sapper different from Next.js?",
            slug: "how-is-sapper-different-from-next",
            likes: 0,
            html: `
              <p><a href='https://github.com/zeit/next.js'>Next.js</a> is a React framework from <a href='https://vercel.com/'>Vercel</a>, and is the inspiration for Sapper. There are a few notable differences, however:</p>
        
              <ul>
                <li>It's powered by <a href='https://svelte.dev'>Svelte</a> instead of React, so it's faster and your apps are smaller</li>
                <li>Instead of route masking, we encode route parameters in filenames. For example, the page you're looking at right now is <code>src/routes/blog/[slug].svelte</code></li>
                <li>As well as pages (Svelte components, which render on server or client), you can create <em>server routes</em> in your <code>routes</code> directory. These are just <code>.js</code> files that export functions corresponding to HTTP methods, and receive Express <code>request</code> and <code>response</code> objects as arguments. This makes it very easy to, for example, add a JSON API such as the one <a href='blog/how-is-sapper-different-from-next.json'>powering this very page</a></li>
                <li>Links are just <code>&lt;a&gt;</code> elements, rather than framework-specific <code>&lt;Link&gt;</code> components. That means, for example, that <a href='blog/how-can-i-get-involved'>this link right here</a>, despite being inside a blob of HTML, works with the router as you'd expect.</li>
              </ul>
            `.replace(/  *</g, '<'),
          },
          {
            title: "How can I get involved?",
            slug: "how-can-i-get-involved",
            likes: 0,
            html: `
              <p>We're so glad you asked! Come on over to the <a href='https://github.com/sveltejs/svelte'>Svelte</a> and <a href='https://github.com/sveltejs/sapper'>Sapper</a> repos, and join us in the <a href='https://svelte.dev/chat'>Discord chatroom</a>. Everyone is welcome, especially you!</p>
            `.replace(/  *</g, '<'),
          }
        ],
      },
    },
  })
  console.log('added post with author:\n', postWithAuthor)
}
