Superheroic Tallying
====================

The Application
---------------

**Superheroic Tallying: an AngularJS Kata** is a demonstration of a
simple CRUD application, built in AngularJS from scratch using strict
application of test-driven development. The application was built
outside-in, with a broad BDD-style integration test in test/features.js.

The application, for the present has four principal features:

1.  Provide a display of a tally count.
2.  Provide a means for incrementing the tally count.
3.  Provide a means for resetting the tally count.

As a natural outgrowth of the integration test development, a controller
`AppVM` is built out with separate unit-tests. `AppVM` is tested in
strict isolation.

The Kata
========

We `begin as we always do, with an empty file`, and proceed `outside-in`
with an integration test.  We `will fake it until we make it`, writing
a test assuming a structure we would like to build.

##Building the Walking Skeleton

```javascript
'use strict';
describe('Superheroic Tallying', function(){
  describe('FEATURE: a resettable tally counter page', function(){
    it('SCENARIO: display is zero on creation', function(){
      expect(page.find('.count').text()).toBe('0');
    });
  });
});
```

Which gives us the following error message:

```bash
ReferenceError: Can't find variable: page
```
complaining that page is not an object, so we add `var page={};` yielding 
the following message.

```bash
TypeError: 'undefined' is not a function\
  (evaluating 'page.find('.count')')
```

Now, we could proceed to develop the object, adding a `count` property, but
this kind of `slime` does't move us forward.  We hae a specific object in
mind for the `.find` function: an angular/jQuery element, `page=$();`.

```bash
Expected '' to be '0'
```

And at last, we have an expectation failure!  We are red, so we can write some
production code.

```javascript
var page=$(
  '<div>\
    <div class="count">0</div>\
  </div>'
);
```

And now we are green! Notice that I didn't write any detailed code, or
any code at all. It wasn't necessary since I just `slimed` the zero
character. The test did not require any more, so I didn't do any more.

We can't write any more production code, so its time
to write a little test.  Our second scenario is just another little test:

```javascript
it('SCENARIO: clicking a tally button increments the count', function(){
  page.find('.tally').click();
  expect(page.find('.count').text()).toBe('1');
});
```

and immediately get a new expectation message:

```bash
Expected '0' to be '1'
```

But now we are at an impasse.  I can't slime the '1', without breaking the
last test.  We know that we need a more dynamic solution, which forces us
to generalize, and so we make page a dynamic angular object by using
the `$compile` and `$rootScope` services.  We turn off the new test and
refactor to set up for new transformations:

```javascript
var page;
beforeEach(function(){
  inject(function($compile, $rootScope){
    page = $compile(
      '<div>\
        <div class="count">0</div>\
      </div>'
    )($rootScope);
    $rootScope.$digest();
  });
});
```

We double-check, and see that we are still green.  And we are building
out the walking skeleton nicely.  But to be a walking skeleton, the
code must be deployable, and a string in an integration test is
anything but.  This is an ideal opportunity to push that string out
to code using the AngularJS ``$templateCache`` service, and karma's build-in
`html2ng` plugin.

```javascript
var page;
module('index.html');
beforeEach(function(){
  inject(function($compile, $rootScope, $templateCache){
    page = $compile(
      $templateCache.get('index.html')
    )($rootScope);
    $rootScope.$digest();
  });
});
```
and
```html
<div>
  <div class="count">0</div>
</div>
```

A final refactoring, extracting the ugly code in the beforeEach to
a function buildPage allows us to replace all that code with a
far more readable: `beforeEach(buildPage)`.

##The Second Scenario

and now we can proceed to spell out the generalization needed to
go green.  We are going to envision this done in a unit-testable
object, such as a controller, which requires we define a module, so
we insert `module('app')` and fix the whining message by instantiating
the module:

```bash
Error: [\$injector:nomod] Module 'app' is not available! You either
misspelled the module name or forgot to load it. If registering a module
ensure that you specify the dependencies as the second argument.
``````

change the message with

```javascript
angular.module('app', [])```


to

```bash
Error: [ng:areq] Argument 'AppVM' is not a function, got undefined
```

and solve this by adding:

```javascript
'use strict';
angular.module('app', [])

.controller('AppVM', function(){
});
```


So now we can wire up the controller to the integration test.
```html
<div ng-controller="AppVM as vm">
  <div class="count">{{ vm.count }}</div>
  <div class="tally" ng-click="vm.tally()"></div>
</div>

```

and the message we gets has all of our tests failing.  But this is
because we don't have the controller written.  Thus, its time to
unit test a controller **in isolation** of the rest of the sysem. We begin

##Building out the controller and unit test.

We cannot write any production for the code until we have a failing test.
So let's write a little test.  We begin:

```javascript
ddescribe('Controller AppVM', function(){
})
```

Note the use of the double-d `ddescribe`.  This "shuts off" the tests
from the integration test, so we can flesh out the controller without
distraction.  We set aside our development of the scenario, to build
out the controller, and then we will reove the "dd" and resume.  We still
don't have a faililng test, so we write a little test.  We don't have a
testing scaffold yet, starting so we ``fake it until we make it.``

```javascript
ddescribe('Controller AppVM', function(){
  it('should expose an initially empty count', function(){
    expect(vm.count).toBe(0);
  });
});
```

This is much like our first scneario.  We improve the messages by
defining vm and setting it to an object, with `var vm={}`.  Our next
step is to generalize by setting vm to an intantiated version of
`AppVM`, thus making the SUT.

```javascript
var vm;
beforeEach(function(){
  module('app');
  inject(function($controller){ vm = $controller('AppVM') });
})```


At last!  We `made it`, and are back to a failing test:

```bash
Expected undefined to be 0.```


We introduce a slime to the controller, `this.count = 0;`, and we are gree!.  It is
time to write another little test.

```javascript
it('should increment count after a call to tally', function(){
  vm.tally();
  expect(vm.count).toBe(1);
});
```

This fails:

```bash
TypeError: 'undefined' is not a function (evaluating 'vm.tally()')`
```

We define `this.tally` to be a function, and the message changes to an
expectation failure.

```bash
Expected 0 to be 1.
```

And now we write the code, using a `slime`.

```javascript
'use strict';
angular.module('app', [])

.controller('AppVM', function(){
  this.count = 0;

  this.tally = function(){
    this.count = 1;
  };
});
```

The use of a `slime` here is important.  I know you want to write bigger
code here.  But the test doesn't require bigger code, so don't do that.
The solution for satisfying your passion to code more is to write another
little test.

```javascript
it('should increase count by 2 after two calls to tally', function(){
  vm.tally();
  vm.tally();
  expect(vm.count).toBe(2);
});
```

yielding the message:

```bash
Expected 1 to be 2.
```
which forces us to generalize.  Changing the 1 to a slied 2 makes the first
test fail.  Adding an if statement to break this out into cases does not
get us closer, and there is a much simpler one-character tranformation to
change the expression, adding a `+` before the `=`.

```javascript
this.tally = function(){
  this.count += 1;
};
```

This finishes the functionality required by the integration test.  Let's
change the `ddescribe` to a `describe` and see what happens.... we're green!

##The last scenario, a reset key.

We add the final scenario, striking the reset key.

```javascript
it('SCENARIO: click a reset button resets the count', function(){
  page.find('.reset').click();
  expect(page.find('.count').text()).toBe('0');
});
```
And we're err... err... geens?  This is a problem.  You see, since
count is initially zero, its no surprise that non-existent and
non-working code does not change that.  But we can't write any code until 
we have a failing test.  So we need to get this test to fail.  Let's
change the count here, by clicking on the tally first.  Now, we have
an expectation failure.

```bash
Expect '1' to be '0'.
```

and wire up the application to use the controller.

```html
<div ng-controller="AppVM as vm">
  <div class="count">{{ vm.count }}</div>
  <div class="tally" ng-click="vm.tally()"></div>
  <div class="reset" ng-click="vm.reset()"></div>
</div>
```
not green yet, so lets go to `AppVM` and write a little test.

```javascript
it('should reset count after a call to tally', function(){
  vm.reset();
  expect(vm.count).toBe(0);    
});
```


and we get the error

```bash
TypeError: 'undefined' is not a function (evaluating 'vm.reset()')
```

we define reset in the controller and change the message to... er, um well
it passes.  Same as before, you can never trust a test for which you 
have not seen it fail with an **expection**  error.  We repair the test
by initializing `vm.count` to null in the test, and fix the green to an expectation
failure.

```bash
Expected null to be '0'.
```

We fix this with a slime, setting `this.count = 0`.  And now, all tests pass. I
refactor the controller slightly to avoid the duplicated `this.count = 0` language
and we are now done with the principal development.  We polish index.html, adding
links to external libraries and deploy the skeleton on Heroku. 

This kata was spelled out in excruciating detail.  We do not skip the steps
taken here in practice, but rather repeat them without comment, as we will
do so in subsequent katas.  I hope that repeating this will help you to
follow along and appreciate the Katas to come.

Bunkai -- Breakdown and Application of the Techniques
-----------------------------------------------------

Superheoric Timekeeping makes use of a number of TDD techniques that are
manifest in the code. These are very useful techniques of general
application worthy of mastery.

-   **Begin With an Empty File.** The less you constrain your
    application with templates and boilerplate code, the more free you
    are to make agile decisions and assure the broadest test coverage.
    The least constrained file, and the only one that requires no tests
    (other than to assure the development system is working) is an empty
    fie.

-   **The Outside-In Strategy.** For your first test, write a simple
    "happy path" integration test to flesh out the structure and basic
    behavior of your application. This tends to compel building the
    Walking Skeleton. When more is required to make a features test
    pass, drill "inside" to components, developed using unit tests, and
    return to the top level. Sometimes you may find it convenient to
    build a component in isolation, turning off testing of the whole
    system, until you have completed the component.

-   **The Walking Skeleton.** First tests are always hard to write. When
    you start with nothing, you might focus your tests to compel
    building a "walking skeleton," the simplest deployable code that
    passes the current test suite. Often this is built using
    `Fake It Until You Make It`.

-   **The TDD Process.** Follow these three steps. Make them little
    steps. Repeat until you can't think of another test to write.\
    When you can't think of another test to write, you are done.

-   **Red -- Write a Little Test.** You may not write a single line of
    production code until you have written a failing test. The test must
    be the simplest test you can consider, and you should eschew writing
    more than one failing test at a time. I know you want to skip steps
    and write code. Don't do that. Exception: For these katas, we do not
    specify detailed design elements -- just the broad strokes of the
    display structure. We leave that to the designers for the most part,
    and they are free to add all the code necessary to realize their
    design, only requiring that they do not break the build.

-   **Green -- Write a Little Code.** Once you have a failing test,
    write the `simplest thing that could possibly work.` Sometime you
    may make a test pass, but doing so makes other tests fail. This is a
    sign that it may be time to generalize.\
    I know you want to write general code right away when the test does
    not require it. Don't do that.

-   **Refactor -- Clean up a Little Mess.** When the code is green, you
    are free to refactor the code *as well as the tests* for style or to
    make next tests easier to write. Do this early. Do this often. Then
    you have only little messes to clean up, and a test suite to support
    you. You can reshuffle and restructure the code all you like -- just
    do not add any new functionality.

-   **The Simplest Thing That Could Possibly Work.** Don't write more
    code than is necessary to pass the test. Even if inserting a
    constant copied (we call this a `slime`) from the test is enough to
    make the test go green, don't generalize! Instead, write another
    test to force the generalization.

-   **Generalize When "Simpler Code" is Too Compex or Fails to advance
    the development.** When the simplest thing leads to greater
    complexity or does not move the development forward, it really isn't
    the "simplest thing" or something that could "possibly work." In
    this case, a more general transformation is used. That said, there
    is a growing sense that some generalizations are preferred over
    others, the so called [Transformation Priority Premise]
    (http://blog.8thlight.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html).
    In his article, Uncle Bob suggests a useful list, from most prefered
    priority to least:

    -   The `slime`.
        -   ({}–\>nil) no code at all-\>code that employs nil
        -   (nil-\>constant)
        -   (constant-\>constant+) a simple constant to a more complex
            constant
    -   The `generalizing transforms`
        -   (constant-\>scalar) replacing a constant with a variable or
            an argument
        -   (statement-\>statements) adding more unconditional
            statements or changing the stements.
        -   (unconditional-\>if) splitting the execution path
        -   (scalar-\>array)
        -   (array-\>container)
        -   (statement-\>recursion)
        -   (if-\>while)
        -   (expression-\>function) replacing an expression with a
            function or algorithm
        -   (variable-\>assignment) replacing the value of a variable.
-   **As the Tests Gets More Specific, the Code Gets More Generic.**
    This mantra, proposed by Uncle Bob, is the consequene of all the
    foregoing.

-   **Fake It Until You Make It.** Particularly at the outset of a test,
    you might find it best to simply write the assertion you ultimately
    want to see passing, and let the system lead you to building the
    `Walking Skeleton` or test setup. Such tests often result in compile
    errors rather than expectation failures. This is just fine. Instead
    of trying to make it pass all at once, simply write the mimimum code
    to change the error message until you get to an expectation fail.

Installation
------------

Assuming you have installed node and bower, the following should execute
the application:

``` {.bash}
git clone https://github.com/wizardwerdna/superheroic-tallying.git
cd superheroic-tallying
npm install && bower install
grunt server
```
