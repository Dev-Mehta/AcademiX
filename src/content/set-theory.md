# Set Theory

Why do we study set theory in computer science?

Tags: #set-theory #databases #algorithms #boolean-algebra #aiml #computer-networks #logic

### Why do programmers care about set theory?

TLDR; -> Databases can not exist without set theory. Mathematical structures such as graphs, and relational algebra's can be defined as sets satisfying some axiomatic conditions. Equivalence relations and order relations from order theory, can be described because of set theory. These mathematical structures defined here are further used in other areas of computer science, which if you want to understand correctly, having a foundation in set theory would be helpful.

## As a programmer, 

Umm, why do I need to study set theory, when all I do is create CRUD apps hidden behind a beautiful layer of design. 

> Even if you aren't solving the higher levels of problems of computer science in your day to day life; if you ever work with a database, you are using **set theory**. What does a database query return? Some subset of data(filtered with conditions) given from your whole database - i.e your superset.

### The Lore

The history of computer science comes from a big effort in math back around the early 1900s. Bertrand Russell, a mathematician, came up with the **barber's paradox**[^1]. He imagines a city that has barbers. Some barbers cut their own hair. Some do not and have others cut it for them. Let's assume only barbers cut hair, and that everyone has to have their hair cut by a barber (they can't grow it out, and no one is bald, etc).

One barber says he (in these examples, it is generally a he) will cut the hair of exactly the barbers that don't cut their own hair. This is fine until he asks whether he should cut his own hair. If he cuts his own hair, he's not cutting exactly the barbers that don't cut their own hair. In particular, he's now cutting his own hair. But if he doesn't cut his own hair, then he's missing a barber that doesn't cut his own hair (namely, himself).

So, math types were wondering if this was a problem with math itself, and they sought to be more precise in their math, hoping this would avoid paradoxes. This turned out not to work as a logician, Kurt Godel[^2], showed that you could write paradoxes in math (the equivalent of "this is not provable").

Anyway, this leads to other efforts to understand computation in general ("what can be computed") which gave birth to [theory of computation](https://en.wikipedia.org/wiki/Theory_of_computation). [Alan Turing](https://en.wikipedia.org/wiki/Alan_turing) is best known for his model called the [Turing machine](https://en.wikipedia.org/wiki/Turing_machine).

Anyway, a lot of computer science had its start in very theoretical, mathematical ideas. While it's lead programmers to write web apps that have zero ideas of such math concepts, it was the theory that came first, before the practicality of programming came to dominate programming.

The number of programmers interested in math like set theory is pretty small. Most lack the math acumen to do this.

### Use cases

Set theory is commonly used in the study of algorithms; analysis of time and space complexity maps algorithms in to sets of algorithms with similar properties; Many notable problems are organized in to sets ( P, NP, NP hard etc…) which helps reason about what is and isn’t computable.

Combinatorics can be useful for problem solving and algorithmic analysis and heavily uses set theory. Set theory is just something that comes up frequently in academic computer science.

Relational Database exist only because of set theory. Database management systems are pretty much exactly set theory implemented in code. Database tables are sets, query results are sets, tables joined to one another create new sets and understanding set theory is extremely important if you want to understand database theory.

[^1]: Barber's Paradox: https://en.wikipedia.org/wiki/Barber_paradox
[^2]: Kurt Gödel: https://en.wikipedia.org/wiki/Kurt_G%C3%B6del

## Learn from here

https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/

https://www.people.vcu.edu/~rhammack/BookOfProof/ - Book of Proof by Richard Hammack (Free Resource)

https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/resources/mit6_042jf10_notes/ - Lecture notes of MIT 6.042