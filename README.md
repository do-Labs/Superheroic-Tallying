# Superheroic Timekeeping

## The Application

**Superheroic Timekeeping: an AngularJS Kata** is a demonstration of a simple 
  CRUD application, built in AngularJS from scratch using strict application 
  of test-driven development.  The application was built outside-in, 
  with a broad BDD-style integration test in test/features.js.

  The application, for the present has four principal features:

  1. Display list of timesheet entries sorted by date.
  1. Create a new timesheet entry.
  1. Update an existing timesheet entry.
  1. Destroy an existing timesheet entry.

As a natural outgrowth of the integration test development, a controller `AppVM`
and a repository-like service, `entries` are built out with separate unit-tests.
It is significant to note that `AppVM` and `entries` are tested in strict isolation.
A few techniques are should be pointed out:

1. The use of DI to dramatically simplify testing.  Note that very little setup
or resonstruction is used to test functionality in response to user interaction
to confirm intent to delete.  In this case, the `$window` service is used in the
code to reach the browser `notify` function.  In the integration tests, $window
is decorated to substitute a mock returning a specified value.

1. Limited use of jasmine mock functionality.  We use spies solely to test in
isolation that an external API `command` is used.  If the return value is
important for the correctness of a test, the testing for that case should 
be in the API unit test.  I tend to prefer direct testing of functionality with 
hand-made mocks using javacript objects.

## Next Steps

Obvious next steps include better validation at many levels, and to deepen the
unhappy path and error-checking portions of code.  Another obvious step is
to add persitence, either by localStorage, a rest service, or a synchronized
three-way data-binding service.  As built out, these are relatively
straightforward exercises.

Some obvious refactorings are required to make the code more useful.  `AppVM`
is unhealthily coupled to view elements with confirm.  It is unclear how to
generalize the `entries` service to plug in new persitence strategies.

## Bunkai -- Breakdown and Application of the Techniques

Superheoric Timekeeping makes use of a number of TDD techniques that are manifest in the code. 
These are very useful techniques of general application worthy of mastery.

* **Start With an Empty File.** The less you constrain your application with
templates and boilerplate code, the more free you are to make agile decisions and assure
the broadest test coverage.  The least constrained file, and the only one that
requires no tests (other than to assure the development system is working) is
an empty fie.

* **The Outside-In Strategy.**  For your first test, write a simple
"happy path" integration test to flesh out the structure and basic behavior
of your application.  This tends to compel building the Walking Skeleton.
When more is required to make a features test pass, drill "inside" to components,
developed using unit tests, and return to the top level.  Sometimes you may
find it convenient to build a component in isolation, turning off testing
of the whole system, until you have completed the component.

* **The Walking Skeleton.**  First tests are always hard to write. When you
start with nothing, you might focus your tests to compel building a
"walking skeleton," the simplest deployable code that passes the current test
suite.  Often this is built using `Fake It Until You Make It`.


* **The TDD Process.** Follow these three steps. Make them little steps.
Repeat until you can't think of another test to write.  
When you can't think of another test to write, you are done.

  * **Red -- Write a Little Test.**  You may not write a single line of 
production code until you have written
a failing test.  The test must be the simplest test you can consider, and you
should eschew writing more than one failing test at a time.  I know you want to
skip steps and write code.  Don't do that.  Exception: For these katas,
we do not specify detailed design elements -- just the broad strokes of the
display structure.  We leave that to the designers for the most part, and
they are free to add all the code necessary to realize their design, only
requiring that they do not break the build.

  * **Green -- Write a Little Code.**  Once you have a failing test, write the 
`simplest thing that could possibly work.`  Sometime you may make a test 
pass, but doing so makes other tests
fail.  This is a sign that it may be time to generalize.  
I know you want to write general code right away when the test
does not require it.  Don't do that.

  * **Refactor -- Clean up a Little Mess.** When the code is green, you are 
free to refactor the code *as well as the tests* for
style or to make next tests easier to write. Do this early.  Do this often.
Then you have only little messes to clean up, and a test suite to support you.
You can reshuffle and restructure the code all you like -- just do not add any
new functionality.

* **The Simplest Thing That Could Possibly Work.** Don't write more code than
is necessary to pass the test.  Even if inserting a constant copied (we call this
a `slime`) from the test is enough to make the test go green, don't generalize!
Instead, write another test to force the generalization.

* **Generalize When "Simpler Code" is Too Compex or Fails to advance the 
development.** When the simplest thing leads to greater complexity or does not 
move the development forward, it really isn't the "simplest thing" or 
something that could "possibly work." In this case, a more general transformation
is used.  That said, there is a growing sense that some generalizations are preferred
over others, the so called [Transformation Priority Premise]
(http://blog.8thlight.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html).  In his
article, Uncle Bob suggests a useful list, from most prefered priority to least:

    * The `slime`.
        * ({}–>nil) no code at all->code that employs nil
        * (nil->constant)
        * (constant->constant+) a simple constant to a more complex constant
    * The `generalizing transforms`
        * (constant->scalar) replacing a constant with a variable or an argument
        * (statement->statements) adding more unconditional statements.
        * (unconditional->if) splitting the execution path
        * (scalar->array)
        * (array->container)
        * (statement->recursion)
        * (if->while)
        * (expression->function) replacing an expression with a function or algorithm
        * (variable->assignment) replacing the value of a variable.

* **As the Tests Gets More Specific, the Code Gets More Generic.** This mantra,
proposed by Uncle Bob, is the consequene of all the foregoing. 

* **Fake It Until You Make It.**  Particularly at the outset of a test, you might
find it best to simply write the assertion you ultimately want to see passing,
and let the system lead you to building the `Walking Skeleton` or test setup.  Such tests
often result in compile errors rather than expectation failures.  This is just
fine.  Instead of trying to make it pass all at once, simply write the mimimum
code to change the error message until you get to an expectation fail.

## Installation

Assuming you have installed node and bower, the following should execute 
the application:

```bash
git clone https://github.com/wizardwerdna/superheroic-timekeeping.git
cd superheroic-timekeeping
npm install && bower install
grunt server
```
