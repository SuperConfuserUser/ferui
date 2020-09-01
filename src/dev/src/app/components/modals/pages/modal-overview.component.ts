import { Component } from '@angular/core';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col-12">
          <h2 class="mt-4 mb-4">Overview</h2>

          <p>
            A lot of other UI frameworks have designed modals (also called dialogs) system using an HTML approach (you build your
            modal in HTML from scratch, you assign it an ID, then using a service you're calling this modal and display it on
            screen). This is not a bad approach but the downside of this is that it forces the devs to create the modal template
            from scratch (meaning that the developer need to learn what components and css classes to use and if he want to have
            the same design everywhere, he need to be extra cautious and ask his team to do the same.
          </p>
          <p>
            In FerUI modal we decided to go with a completely different approach. <br />
            First of all, we only have a service to open/close the modal and every elements of the modal are loaded into the DOM
            only when the user decides to open it.<br />
            Through this service you can open a Standard/Headless modals or a wizard, and thanks to the
            <code>FuiModalWindowCtrl</code> controller (available for every window of your modal) you can also control the state
            of your window an even open a child window if you need to. That way you'll use exactly the same design everywhere, and
            you and your team mates won't need to know every modal design component to build a modal from scratch. But, you still
            can override the default design of course, and even override only some parts (i.e: The buttons) if you want.
          </p>

          <h4 class="mt-4 mb-4">1. Terminology</h4>

          <p>
            Its important to understand how <code>Modal</code>, <code>Window</code> and <code>Screen</code> are used within this
            documentation and how they're distinguished as separate concepts within our component.
          </p>

          <ul>
            <li>
              <strong>Modal</strong>: A collection of one or more windows which are linked together to provide a standalone
              workflow for modifying settings or initiating an action.
            </li>
            <li>
              <strong>Window</strong>: A dialog that appears above application content to present options, actions or information.
              May have parent/child windows and is always associated with exactly one Modal.
            </li>
            <li>
              <strong>Screen</strong>: An Angular component to be compiled within the window. It should implement either
              <code>FuiModalStandardWindowScreen</code> for standard window, <code>FuiModalWizardWindowScreen</code> for wizard
              window or <code>FuiModalHeadlessWindowScreen</code> for headless window.
            </li>
          </ul>

          <h4 class="mt-4 mb-4">2. How to use it?</h4>

          <p>
            Once you have access to the <code>FuiModalService</code> object, you can just use the
            <code>.openModal(...)</code> function or the <code>.closeModal()</code> function to either open or close the modal
            (this will destroy all windows, kill all watchers and remove everything related to the modal from the DOM).
          </p>

          <h5 class="mt-4 mb-4">FerUI modal service (<code>FuiModalService</code>)</h5>

          <p>As explain above, we have built a service that allows you to easily open a modal wherever you'd like.</p>

          <p>First of all you need to inject the service in your component:</p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample2"></code></pre>

          <p>Then you call the <code>openModal(...)</code> function to open the modal:</p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample3"></code></pre>
          <p>Lets take a deeper look at <code>.openModal()</code> function for a moment. Here is all options available:</p>
          <table class="fui-table mt-4 mb-4">
            <thead>
              <tr>
                <th width="200">Parameter</th>
                <th width="295">Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>windowConfiguration</td>
                <td><code>FuiModalWindowConfiguration</code></td>
                <td>
                  [<strong>Mandatory</strong>] This is the configuration object for your modal. This is where you declare all
                  possible windows, customize the buttons... of your modal.
                </td>
              </tr>
              <tr>
                <td>windowPromises</td>
                <td><code>FuiModalWindowResolve</code></td>
                <td>
                  [<strong>Optional</strong>] You can specify a list of promises that need to be resolve before compiling the
                  first window. You'll be able to access the result of each promises from every windows of the modal.
                </td>
              </tr>
              <tr>
                <td>params</td>
                <td><code>FuiModalWindowParam</code></td>
                <td>
                  [<strong>Optional</strong>] This is the extra params you want to be shared between each window of the modal.
                </td>
              </tr>
              <tr>
                <td>anchorHost</td>
                <td><code>HTMLElement</code></td>
                <td>
                  [<strong>Optional</strong>] If you still live in the 2000s and you need to run FerUI modals within an iFrame,
                  this argument is important because it allows you to specify where the modal should be added (By default, it will
                  be added within the <code>document.body</code>).
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            As you may have noticed in the example above, the <code>.openModal()</code> function returns a Promise that resolves
            with any data you may want to return from any of your window components and reject with an error if it fails somehow.
            This is really useful when you open a modal to create/update/delete an entity and want to use it directly.<br />
            See <a target="_blank" [routerLink]="['/components/modals/standard']">Standard</a>,
            <a target="_blank" [routerLink]="['/components/modals/headless']">Headless</a> or
            <a target="_blank" [routerLink]="['/components/modals/wizard']">Wizard</a> examples for more information.
          </p>

          <h5 class="mt-4 mb-4">Modal Configuration object (<code>FuiModalWindowConfiguration</code>)</h5>

          <p>
            The <code>FuiModalWindowConfiguration</code> object is the spearhead of the <code>FuiModalService</code>
            service. It contains all the configuration needed to open a modal with either one or multiple windows.
          </p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample1"></code></pre>

          <h5 class="mt-4 mb-4">
            Window initial Promises (<code>FuiModalWindowResolve</code> and <code>FuiModalWindowResolved</code>)
          </h5>
          <p>
            The <code>FuiModalWindowResolve</code> object represent the list of Promises that you want to be resolved before even
            displaying the window screen. The modal will try to resolves all promises then display the screen or display an error
            screen in case of one of the promises fail. If all promise gets resolved, you'll have access the their resolved state
            (<code>FuiModalWindowResolved</code>) from any window controller <code>resolves</code> attribute
            (<code>this.windowCtrl.resolves</code>).
          </p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample7"></code></pre>

          <h5 class="mt-4 mb-4">Modal initial Params (<code>FuiModalWindowParam</code>)</h5>
          <p>
            The <code>FuiModalWindowParam</code> object represent the list of parameters that you want to share between all
            windows.
          </p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample8"></code></pre>

          <h4 class="mt-4 mb-4">
            3. Component Screens (<code>FuiModalStandardWindowScreen</code>, <code>FuiModalWizardWindowScreen</code> and
            <code>FuiModalHeadlessWindowScreen</code>)
          </h4>
          <p>
            The screen represent the component that you want to be compiled into a modal window. As we have multiple types of
            window we also have multiple types of screen for each window types. <br />
            In each screen, you can use whatever other component that you may have in your application, you just need to inject
            them in the screen constructor (like you would do with any Angular components), that allow you a lot of
            flexibility.<br />
            <strong>Note</strong>: Each screens can access their own window controller as well as the global modal controller.
          </p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample4"></code></pre>

          <p>
            <strong>Note</strong>: As you may have noticed, the modal window screens can be heavily typed. We're giving developers
            the choice to type every possible data returning from each lifecycle. By default, each function will use the
            <code>any</code> type.
          </p>

          <p><strong>Naming normalisation for types:</strong></p>

          <ul>
            <li>
              The <code>I</code> type represent the return for the <strong>$init()</strong> and
              <strong>$onInit()</strong> functions.
            </li>
            <li>
              The <code>CL</code> type represent the return for the <strong>$close()</strong> and
              <strong>$onClose()</strong> functions.
            </li>
            <li>
              The <code>S</code> type represent the return for the <strong>$submit()</strong> and
              <strong>$onSubmit()</strong> functions.
            </li>
            <li>
              The <code>C</code> type represent the return for the <strong>$cancel()</strong> and
              <strong>$onCancel()</strong> functions.
            </li>
            <li>
              The <code>N</code> type represent the return for the <strong>$next()</strong> and
              <strong>$onNext()</strong> functions.
            </li>
            <li>
              The <code>B</code> type represent the return for the <strong>$back()</strong> and
              <strong>$onBack()</strong> functions.
            </li>
            <li>The <code>P</code> type represent the desired type for the <strong>params</strong> attribute.</li>
            <li>The <code>R</code> type represent the desired type for the <strong>resolves</strong> attribute.</li>
          </ul>

          <p>
            <strong>IMPORTANT</strong>: Since the screen components will be dynamically compiled, don't forget to add them to your
            ngModule <code>entryComponents</code> section.
          </p>
          <pre><code [languages]="['typescript']" [highlight]="modalExample5"></code></pre>

          <p><strong>Example of a component Screen</strong></p>

          <pre><code [languages]="['typescript']" [highlight]="modalExample6"></code></pre>

          <h4 class="mt-4 mb-4">4. Window Types</h4>
          <p>
            As you may have noticed in the previous examples, we have multiple kind of window type available for modals. Each
            types have their own specificity and we will list them all in the next section.
          </p>

          <p>There is currently 3 types of window:</p>
          <ul>
            <li>
              <code>STANDARD</code>: This is the default type of window. It allows you to have a modal window with interactions
              like a submit or cancel buttons. Really useful for modals that submits a form.
            </li>
            <li>
              <code>HEADLESS</code>: This type of window won't have any header nor footer. The only interaction possible is the
              close button. Really useful when you just want to show informational data to users.
            </li>
            <li>
              <code>WIZARD</code>: This type of window allows you to have a wizard modal that might have an header and a footer
              with multiple kind of interactions possibles (cancel, submit, next, back). Useful when you need to have a workflow
              in multiple steps.
            </li>
          </ul>

          <h4 class="mt-4 mb-4">5. Window Workflow</h4>
          <p>
            Each window type has their own internal workflow:
          </p>

          <h5>Headless Workflow</h5>
          <p>
            This kind of window is useful when you want to display only informational data with no special interactions. Like
            explained above, the headless window type doesn't have header nor footer, that mean the only interactions possibles
            are <strong>opening</strong> or <strong>close</strong> the window.
          </p>

          <h5>Standard Workflow</h5>
          <p>
            Unlike <strong>Headless</strong> workflow, the standard window type offer more options like having a pre-formatted
            header (or no header) and a footer (or no footer) with two different footer actions:
          </p>
          <ul>
            <li>
              <strong>Submit</strong>: This action allows you to submit some data (like a login form for instance) and retrieve
              the result of this submit from the <code>.then(SubmitArgs)</code> function of your
              <code>FuiModalService.openModal(...)</code> or <code>windowCtrl.openChildModal(...)</code> functions.
            </li>
            <li><strong>Cancel</strong>: This action allows you to cancel the current workflow by closing the current window.</li>
          </ul>

          <h5>Wizard Workflow</h5>
          <p>
            Like <strong>Standard</strong> workflow, the wizard window type offer the same options along with more footer actions
            like:
          </p>
          <ul>
            <li>
              <strong>Next</strong>: This action allows you to go to the next step. The <strong>$next</strong> action offers the
              ability to send some data to the next screen (it will be retrieved by next screen component
              <strong>$onInit(args)</strong> lifecycle).
            </li>
            <li>
              <strong>Back</strong>: This action allows you to go back to the previous step. The <strong>$back</strong>
              action offers the ability to send some data to the previous screen (it will be retrieved by previous screen
              component
              <strong>$onInit(args)</strong> lifecycle).
            </li>
          </ul>

          <img src="./assets/modals/window-workflow-diagram.jpg" width="714" height="1020" />

          <h4 class="mt-4 mb-4">6. Window Screen lifecycle</h4>
          <p>
            Like in Angular, the modal system has its own lifecycle.
          </p>

          <h5 class="mt-4 mb-4">Lifecycle Hooks commons to every window types</h5>
          <table class="fui-table mt-4 mb-4">
            <thead>
              <tr>
                <th width="400">Lifecycle Hook</th>
                <th width="150">Return type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>$onInit?(args?: any)</code></td>
                <td><code>Promise&lt;I&gt;</code></td>
                <td>
                  This hook is called each time a screen has been initialised and it will retrieve any args sent by other
                  lifecycle hook. By default the args will be undefined (if it is the first window for instance)
                </td>
              </tr>
              <tr>
                <td><code>$onClose?(event?: MouseEvent | KeyboardEvent)</code></td>
                <td><code>Promise&lt;CL&gt;</code></td>
                <td>
                  This hook is called each time a window is closing. That allows you to block a window close event if needed or to
                  do extra stuff just before the window gets closed.
                </td>
              </tr>
            </tbody>
          </table>

          <h5 class="mt-4 mb-4">Lifecycle Hooks specific to <code>Standard</code> window type</h5>
          <table class="fui-table mt-4 mb-4">
            <thead>
              <tr>
                <th width="400">Lifecycle Hook</th>
                <th width="150">Return type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>$onSubmit?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;S&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$submit</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error) but also send data back to
                  <code>FuiModalService.openModal(...)</code> or <code>windowCtrl.openChildWindow(...)</code>
                  <strong>.then(args => &#x0007B;&#x0007D;)</strong> function.
                </td>
              </tr>
              <tr>
                <td><code>$onCancel?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;C&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$cancel</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error).
                </td>
              </tr>
            </tbody>
          </table>

          <h5 class="mt-4 mb-4">Lifecycle Hooks specific to <code>Wizard</code> window type</h5>
          <table class="fui-table mt-4 mb-4">
            <thead>
              <tr>
                <th width="400">Lifecycle Hook</th>
                <th width="150">Return type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>$onSubmit?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;S&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$submit</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error) but also send data back to
                  <code>FuiModalService.openModal(...)</code> or <code>windowCtrl.openChildWindow(...)</code>
                  <strong>.then(args => &#x0007B;&#x0007D;)</strong> function.
                </td>
              </tr>
              <tr>
                <td><code>$onCancel?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;C&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$cancel</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error).
                </td>
              </tr>
              <tr>
                <td><code>$onBack?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;B&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$back</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error) but also send data back to
                  previous screen <strong>$onInit(backArgs)</strong> hook.
                </td>
              </tr>
              <tr>
                <td><code>$onNext?(event?: MouseEvent)</code></td>
                <td><code>Promise&lt;N&gt;</code></td>
                <td>
                  This hook is called each time the <strong>$next</strong> action is called. This action is a Promise and it
                  allows you to block the action (by rejecting the promise or throwing an error) but also send data to next screen
                  <strong>$onInit(nextArgs)</strong> hook.
                </td>
              </tr>
            </tbody>
          </table>

          <h4 class="mt-4 mb-4">7. Modal & Window Controllers</h4>
          <p>
            Like explained above, you'll have access to both modal and window controllers from every screen component which allows
            you to manipulate the modal to fit your needs.
          </p>

          <p>
            <strong>IMPORTANT</strong>: If you're planing to dynamically update the window based on some condition within your
            screen component, please make every changes from the <code>$onInit()</code> lifecycle function.
          </p>

          <p>Here is the modal controller API:</p>

          <h5 class="mt-4 mb-4">Modal controller</h5>

          <fui-tabs>
            <fui-tab [title]="'Documentation'" [active]="true">
              <table class="fui-table mt-4 mb-4">
                <thead>
                  <tr>
                    <th width="200">Parameter</th>
                    <th width="295">Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>data</td>
                    <td><code>any</code></td>
                    <td>
                      The data attribute allows you to store any kind of data within the modal in order to access it from each
                      windows. Its usage is not recommended but it can be useful in some cases.
                    </td>
                  </tr>
                  <tr>
                    <td>params</td>
                    <td><code>FuiModalWindowParam</code></td>
                    <td>
                      This attribute will contains all parameters that you've initially set when you've called the
                      <code>.openModal()</code> function. Its value can be updated and it will be accessible from any screen.
                    </td>
                  </tr>
                  <tr>
                    <td>resolves</td>
                    <td><code>FuiModalWindowResolved</code></td>
                    <td>
                      This attribute contains every resolved promises you've initially set when you've called the
                      <code>.openModal()</code> function. Its value can be updated and it will be accessible from any screen.
                    </td>
                  </tr>
                </tbody>
              </table>
            </fui-tab>
            <fui-tab [title]="'Interface'">
              <pre><code [languages]="['typescript']" [highlight]="modalExample9"></code></pre>
            </fui-tab>
          </fui-tabs>

          <p>Here is the list of every window type controllers and their respective API:</p>

          <h5 class="mt-4 mb-4">Common to every Window controller</h5>

          <fui-tabs>
            <fui-tab [title]="'Documentation'" [active]="true">
              <table class="fui-table mt-4 mb-4">
                <thead>
                  <tr>
                    <th width="200">Parameter</th>
                    <th width="295">Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>cssClass</td>
                    <td><code>string</code></td>
                    <td>
                      List of extra classes that you want to add to the window. The classes names should be space separated if
                      more than one.
                    </td>
                  </tr>
                  <tr>
                    <td>id</td>
                    <td><code>string</code></td>
                    <td>
                      The unique identifier for your current window.<br />
                      By default, we generate a unique ID if you haven't set an ID within the modal configuration object.
                    </td>
                  </tr>
                  <tr>
                    <td>width</td>
                    <td><code>number</code></td>
                    <td>
                      The width of the window. <br />
                      Default values are 600px for <strong>Standard</strong> and <strong>Headless</strong> windows and 770px for
                      <strong>Wizard</strong> window.
                    </td>
                  </tr>
                  <tr>
                    <td>closeButton</td>
                    <td><code>boolean</code></td>
                    <td>
                      Whether or not you want to display the close icon (little cross on the top right side of a window). You can
                      still close the modal if you press the <kbd>Esc</kbd> key and the modal will close on submit too.<br />
                      It is set to <strong>true</strong> by default.
                    </td>
                  </tr>
                  <tr>
                    <td>error</td>
                    <td><code>string | Error</code></td>
                    <td>
                      If you want to display some error within the window itself. This variable is used internally to display any
                      error that may occur (Promise rejection).<br />
                      It is set to <strong>undefined</strong> by default.
                    </td>
                  </tr>
                  <tr>
                    <td>hasChildWindowOpen</td>
                    <td><code>boolean</code></td>
                    <td>Default to <strong>false</strong>. Whether or not the current window has a child window opened.</td>
                  </tr>
                  <tr>
                    <td>closeConfirm</td>
                    <td><code>boolean</code></td>
                    <td>
                      Default to <strong>false</strong>. Whether or not you want a user confirmation before closing the modal. It
                      can be dynamically set to true from the <strong>windowCtrl</strong> within the
                      <strong>$onInit()</strong> lifecycle.
                    </td>
                  </tr>
                  <tr>
                    <td>params</td>
                    <td><code>FuiModalWindowParam</code></td>
                    <td>
                      The extra params you may have passed to the <code>.openModal()</code> function. Note that if you update this
                      variable it will be updated only for the current window opened. <br />
                      If you want to update it for every window, you must use the Modal Controller instead
                      (<code>FuiModalCtrl</code>).
                    </td>
                  </tr>
                  <tr>
                    <td>resolves</td>
                    <td><code>FuiModalWindowResolved</code></td>
                    <td>
                      The list of resolved promises. This list will contains only the result of each promise, not the promise
                      itself.
                    </td>
                  </tr>
                </tbody>
              </table>
            </fui-tab>
            <fui-tab [title]="'Interface'">
              <pre><code [languages]="['typescript']" [highlight]="modalExample10"></code></pre>
            </fui-tab>
          </fui-tabs>

          <h5 class="mt-4 mb-4">Headless Window controller (<code>FuiModalHeadlessWindowCtrl</code>)</h5>

          <fui-tabs>
            <fui-tab [title]="'Documentation'" [active]="true">
              The <strong>Headless</strong> window type uses the common API.
            </fui-tab>
            <fui-tab [title]="'Interface'">
              <pre><code [languages]="['typescript']" [highlight]="modalExample11"></code></pre>
            </fui-tab>
          </fui-tabs>

          <h5 class="mt-4 mb-4">Standard Window controller (<code>FuiModalStandardWindowCtrl</code>)</h5>

          <fui-tabs>
            <fui-tab [title]="'Documentation'" [active]="true">
              <table class="fui-table mt-4 mb-4">
                <thead>
                  <tr>
                    <th width="200">Parameter</th>
                    <th width="295">Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>title</td>
                    <td><code>string</code></td>
                    <td>
                      The title text you want for the window.<br />
                      WARNING: Use <code>title</code> or <code>titleTemplate</code> but not together.
                    </td>
                  </tr>
                  <tr>
                    <td>subtitle</td>
                    <td><code>string</code></td>
                    <td>
                      The sub-title text you want for the window.<br />
                      WARNING: Use<code>subtitle</code> only if you also use <code>title</code> option. If you use
                      <code>titleTemplate</code> it will be ignored.
                    </td>
                  </tr>
                  <tr>
                    <td>titleTemplate</td>
                    <td><code>TemplateRef&lt;any&gt;</code></td>
                    <td>
                      This option allows you to use your own header template. You can basically create an
                      <code>ng-template</code> and link its reference to the modal configuration. It will be placed within the
                      header section.
                    </td>
                  </tr>
                  <tr>
                    <td>submitButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the submit button.</td>
                  </tr>
                  <tr>
                    <td>cancelButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the cancel button.</td>
                  </tr>
                  <tr>
                    <td>withSubmitBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the submit button.</td>
                  </tr>
                  <tr>
                    <td>withCancelBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the cancel button.</td>
                  </tr>
                </tbody>
              </table>
            </fui-tab>
            <fui-tab [title]="'Interface'">
              <pre><code [languages]="['typescript']" [highlight]="modalExample12"></code></pre>
            </fui-tab>
          </fui-tabs>

          <p>
            <strong>Note 1</strong>: If <code>title</code>, <code>subtitle</code> and <code>titleTemplate</code> are null or
            undefined, there will be no header at all.<br />
            <strong>Note 2</strong>: If <code>withSubmitBtn</code> and <code>withCancelBtn</code> are both set to
            <strong>false</strong>, there will be no footer at all. <br />
            In this case, you'll need to call respectively <code>windowCtrl.$submit(event: MouseEvent)</code>,
            <code>windowCtrl.$cancel(event: MouseEvent)</code> on your own.
          </p>

          <h5 class="mt-4 mb-4">Wizard Window controller (<code>FuiModalWizardWindowCtrl</code>)</h5>

          <fui-tabs>
            <fui-tab [title]="'Documentation'" [active]="true">
              <table class="fui-table mt-4 mb-4">
                <thead>
                  <tr>
                    <th width="200">Parameter</th>
                    <th width="295">Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>title</td>
                    <td><code>string</code></td>
                    <td>
                      The title text you want for the window.<br />
                      WARNING: Use <code>title</code> or <code>titleTemplate</code> but not together.
                    </td>
                  </tr>
                  <tr>
                    <td>subtitle</td>
                    <td><code>string</code></td>
                    <td>
                      The sub-title text you want for the window.<br />
                      WARNING: Use<code>subtitle</code> only if you also use <code>title</code> option. If you use
                      <code>titleTemplate</code> it will be ignored.
                    </td>
                  </tr>
                  <tr>
                    <td>titleTemplate</td>
                    <td><code>TemplateRef&lt;any&gt;</code></td>
                    <td>
                      This option allows you to use your own header template. You can basically create an
                      <code>ng-template</code> and link its reference to the modal configuration. It will be placed within the
                      header section.
                    </td>
                  </tr>
                  <tr>
                    <td>submitButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the submit button.</td>
                  </tr>
                  <tr>
                    <td>cancelButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the cancel button.</td>
                  </tr>
                  <tr>
                    <td>backButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the back button.</td>
                  </tr>
                  <tr>
                    <td>nextButton</td>
                    <td><code>FuiModalButtonInterface</code></td>
                    <td>If you want to change the look and label for the next button.</td>
                  </tr>
                  <tr>
                    <td>withSubmitBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the submit button.</td>
                  </tr>
                  <tr>
                    <td>withCancelBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the cancel button.</td>
                  </tr>
                  <tr>
                    <td>withBackBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the back button.</td>
                  </tr>
                  <tr>
                    <td>withNextBtn</td>
                    <td><code>boolean</code></td>
                    <td>Whether or not you want to display the next button.</td>
                  </tr>
                </tbody>
              </table>
            </fui-tab>
            <fui-tab [title]="'Interface'">
              <pre><code [languages]="['typescript']" [highlight]="modalExample13"></code></pre>
            </fui-tab>
          </fui-tabs>

          <p>
            <strong>Note 1</strong>: If <code>title</code>, <code>subtitle</code> and <code>titleTemplate</code> are set to null
            or undefined, there will be no header at all.<br />
            <strong>Note 2</strong>: If <code>withSubmitBtn</code>, <code>withCancelBtn</code>, <code>withBackBtn</code>
            and
            <code>withNextBtn</code> are all set to <strong>false</strong>, there will be no footer at all. <br />
            In this case, you'll need to call respectively <code>windowCtrl.$submit(event: MouseEvent)</code>,
            <code>windowCtrl.$cancel(event: MouseEvent)</code>, <code>windowCtrl.$back(event: MouseEvent)</code> and
            <code>windowCtrl.$next(event: MouseEvent)</code> on your own to control the workflow.
          </p>

          <h4 class="mt-4 mb-4">8. Error handling</h4>
          <p>
            The modal system has its own way to handle errors that may occur at different states of a window workflow:
          </p>

          <ul>
            <li>
              <strong>Developer mistake error</strong>: If the error is a compilation issue (the dev set an un-existing component
              or the component doesn't compile at all for any reason or the dev is trying to open a child window that doesn't
              exist...) the modal won't open and you'll just see an error inside the browser console.
            </li>
            <li>
              <strong>Initialisation error</strong>: If an error occur during initialisation lifecycle or if one of the initial
              promises is rejected, then the window you're trying to open will be replaced by an error window which will only
              display the error that occur. The main window won't even been compiled, only the error window will.
            </li>
            <li>
              <strong>In window error</strong>: Any other kind of errors occurring after the window is fully compiled and
              initialized will be displayed within the window itself, at the top of the body section like shown in the next
              picture:
            </li>
          </ul>

          <img src="./assets/modals/window-error-example.jpg" width="782" height="709" />

          <p class="mt-4">
            <strong>Note</strong>: At any moment, you can access the <code>windowCtrl.error</code> attribute from your component
            screen. That allows you to display any kind of errors or clean an error that has been displayed.<br />
            By default, every-time that a lifecycle hook promise is rejected, the <strong>rejection error</strong> will be
            displayed in screen so that the user may be noticed.
          </p>

          <p>In case of an error, the window workflow will be frozen until there is no error anymore.</p>

          <p>
            A good example for testing error handling is the
            <a [fragment]="'standard-window-examples'" [routerLink]="['/components/modals/standard']">"Example 2"</a> modal from
            the standard section (Just try to submit an empty form).
          </p>

          <h4 class="mt-4 mb-4">9. Close confirmation</h4>
          <p>
            In some cases, you may want to force your users to do an action and prevent them to close the window accidentally. In
            this case, you want to ask the user a confirmation to close the window.<br />
            This is really a simple thing to do, you only need to specify that your modal needs a close confirmation by setting
            the <code>closeConfirm</code> attribute of <code>FuiModalWindowConfiguration</code> configuration object to true. The
            window will now need a confirmation to be closed.<br />
            But if you want to ask a confirmation depending on a specific condition, you can also update this attribute from the
            window controller (within <code>$onInit()</code> lifecycle) directly from your screen component (<code
              >this.windowCtrl.closeConfirm = true;</code
            >).
          </p>

          <img src="./assets/modals/window-close-confirm.jpg" width="772" height="536" />

          <p class="mt-4">
            A good example for testing close confirmation is the
            <a [fragment]="'standard-window-examples'" [routerLink]="['/components/modals/standard']">"Example 2"</a> modal from
            the standard section
          </p>
        </div>
      </div>
    </div>
  `
})
export class ModalOverviewComponent {
  modalExample1: string = `interface FuiModalWindowConfiguration {
  // Default config
  component?: Type<any>; // can be either FuiModalStandardWindowScreen or FuiModalWizardWindowScreen or FuiModalHeadlessWindowScreen component.
  id?: string; // If not set, a random unique ID will be generated but it is highly recommended to set your own ID specially for child windows.
  title?: string; // If you want to set a title for your window
  subtitle?: string; // If you want to set a sub-title for your window
  titleTemplate?: TemplateRef<any>; // If you want something more complex, like adding an icon or whatever else just provide a titleTemplate.
  // But be careful to ONLY use either \`title\` + \`subtitle\` OR \`titleTemplate\` because \`titleTemplate\` have the highest priority.
  cssClass?: string; // Extra classes (space separated strings) you want to add to the window (if you want to use a special design for a specific window for instance)
  // Value in px of the window width. This will be a fixed width.
  width?: number; // Default to 600px for Standard and Headless windows and 770px for wizards.
  closeButton?: boolean; // Default to true.
  childWindows?: FuiModalWindowConfiguration[];
  closeConfirm?: boolean; // Whether the window need a confirmation before being closed. Default to false.

  // Standard config
  withSubmitBtn?: boolean; // Default to true.
  withCancelBtn?: boolean; // Default to false.
  submitButton?: FuiModalButtonInterface; // Default label is 'Submit'.
  cancelButton?: FuiModalButtonInterface; // Default label is 'Cancel'.

  // Wizard config
  withNextBtn?: boolean; // Default to true (appear only if there is more steps after current one).
  withBackBtn?: boolean; // Default to true. (appear only if there is steps behind current one).
  nextButton?: FuiModalButtonInterface; // Default label is 'Next'.
  backButton?: FuiModalButtonInterface; // Default label is 'Back'.
  wizardSteps?: FuiWizardStepConfiguration[];
}`;

  modalExample2: string = `import { Component } from '@angular/core';
import { FuiModalService } from '@ferui/components';

@Component({
  template: \`<h1 class="mt-4 mb-4">Example</h1>\`
})
export class ExampleComponent {
  constructor(private modalService: FuiModalService) {}
  // Now you can access the modal service through this.modalService.
}`;

  modalExample3: string = `import { Component } from '@angular/core';
import { FuiModalService } from '@ferui/components';

@Component({
  template: \`<h1 class="mt-4 mb-4">Example</h1>
  <button class="btn btn-sm btn-primary mr-2" (click)="openSimpleModal()">Open simple modal with children</button>\`
})
export class ExampleComponent {
  constructor(private modalService: FuiModalService) {}

  openSimpleModal() {
    this.modalService.openModal<string>({
      id: 'simpleWindow',
      title: 'Simple Window with children',
      component: ModalExample1Component,
      childWindows: [
        {
          id: 'simpleChildWindow1',
          title: 'Simple Child window',
          component: ChildModal1Component
        }
      ]
    })
    .then(args => {
      // The 'args' will be of type 'string' because we've informed the '.openModal()' function of its return type.
      // We're aware of the type because we know the return type of 'ModalExample1Component' $onSubmit() lifecycle function.
      // You now can do whatever you want with it. Here we're just logging it in browser console.
      console.log('[modalService.openModal] openSimpleModal ::: submitted ::: ', args);
    });
  }
}`;

  modalExample4: string = `/**
 * Abstract window screen interface (common to every screen types)
 */
export interface FuiModalWindowScreen<I = any, CL = any> {
  modalCtrl?: FuiModalCtrl;
  $onInit?(args?: any): Promise<I>;
  $onClose?(event?: MouseEvent | KeyboardEvent): Promise<CL>;
}

/**
 * Standard window screen interface
 */
export interface FuiModalStandardWindowScreen<I = any, CL = any, S = any, C = any> extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalStandardWindowCtrl<I, CL, S, C>;
  $onSubmit?(event?: MouseEvent): Promise<S>;
  $onCancel?(event?: MouseEvent): Promise<C>;
}

/**
 * Wizard window screen interface
 */
export interface FuiModalWizardWindowScreen<I = any, CL = any, N = any, B = any, S = any, C = any>
  extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalWizardWindowCtrl<I, CL, N, B, S, C>;
  $onSubmit?(event?: MouseEvent): Promise<S>;
  $onCancel?(event?: MouseEvent): Promise<C>;
  $onBack?(event?: MouseEvent): Promise<B>;
  $onNext?(event?: MouseEvent): Promise<N>;
}

/**
 * Headless window screen interface
 */
export interface FuiModalHeadlessWindowScreen<I = any, CL = any> extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalHeadlessWindowCtrl<I, CL>;
}`;

  modalExample5: string = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeruiModule } from '@ferui/components';
import { ModalExample1Component } from './pages/modals/modal-example-1.component';

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule],
  declarations: [ModalExample1Component],
  exports: [ModalExample1Component],
  entryComponents: [ModalExample1Component]
})
export class ModalDemoModule {}`;

  modalExample6: string = `import { Component, Inject, OnInit } from '@angular/core';
import {
  FuiModalCtrl,
  FuiModalStandardWindowScreen,
  FUI_MODAL_CTRL_TOKEN,
  FuiModalStandardWindowCtrl,
  FUI_MODAL_WINDOW_CTRL_TOKEN
} from '@ferui/components';

@Component({
  template: \`
    <h4>Modal example 3</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
  \`
})
export class ModalExample3Component implements OnInit, FuiModalStandardWindowScreen<void> {
  params: string;
  resolves: string;

  constructor(@Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl,
              @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl<void>) {}

  $onInit(): Promise<void> {
    // IMPORTANT: If you want to modify the window itself,
    // be sure to do it within the $onInit() lifecycle and not the default ngOnInit()

    // Lets be wild and update the window title dynamically.
    this.windowCtrl.title = 'My super wild title!';
    return Promise.resolve();
  }

  ngOnInit(): void {
    // You can use either modalCtrl and windowCtrl now.
    this.params = JSON.stringify(this.modalCtrl.params);
    this.resolves = JSON.stringify(this.modalCtrl.resolves);
  }
}`;

  modalExample7: string = `interface FuiModalWindowResolve {
  readonly [key: string]: Promise<any>;
}

interface FuiModalWindowResolved {
  [key: string]: any;
}`;

  modalExample8: string = `interface FuiModalWindowParam {
  readonly [key: string]: any;
}`;

  modalExample9: string = `interface FuiModalCtrl<D = any, P extends FuiModalWindowParam = any, R extends FuiModalWindowResolved = any> {
  readonly injector: Injector; // [Internal use only] Angular injector
  readonly componentFactoryResolver: ComponentFactoryResolver; // [Internal use only] Angular componentFactoryResolver.
  readonly mainWindowConfiguration: FuiModalWindowConfiguration; // Main window full configuration object
  data: D; // Data shared between all windows. You can specify a type. Default to 'any'.
  params: P; // Params shared between all windows. You can specify a type. Default to 'any'.
  resolves: R; // All promises that you want to resolve. You can specify a type. Default to 'any'.
  mainWindow: FuiModalWindowCtrl<FuiModalWindowScreen>; // The main window controller.
  childWindows: { [id: string]: FuiModalWindowCtrl<FuiModalWindowScreen> }; // List of every child windows controller.
  interactionSubjects: { [key: string]: Subject<ModalWindowInteractionInterface<any>> }; // [Internal use only]
  modalWindowLoadingTplt: TemplateRef<FuiModalWindowTemplateContext>; // The loading template. It can be override.
  modalWindowErrorTplt: TemplateRef<FuiModalWindowTemplateContext>; // The error template. It can be override.
  onWindowInteraction<T>(windowId: string): Promise<ModalWindowInteractionInterface<T>>; // [Internal use only]
  onWindowInteractionObservable<T>(windowId: string): Observable<ModalWindowInteractionInterface<T>>; // [Internal use only]
  resetWindow(windowId: string): void; // [Internal use only] Reset the specified window by cleaning the interactionSubjects.
  getWindowById(windowId: string): FuiModalWindowCtrl<FuiModalWindowScreen>; // Get a specific window controller by its ID
  resolvePromises(
    resolve: FuiModalWindowResolve,
    window: FuiModalWindowCtrl<FuiModalWindowScreen>
  ): Promise<FuiModalWindowCtrl<FuiModalWindowScreen>>; // [Internal use only] Function that allows you to run a list of promise and return a window controller containing the resolved promises.
}`;

  modalExample10: string = `interface FuiModalWindowCtrl<
  S extends FuiModalWindowScreen,
  I = any,
  CL = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> {
  windowConfiguration: FuiModalWindowConfiguration; // Window configuration object
  params: P; // Params shared between all windows. You can specify a type. Default to 'any'.
  resolves: R; // // All resolved promises. You can specify a type. Default to 'any'.
  windowComponentRef: ComponentRef<FuiModalWindowComponentInterface<S>>; // [Internal use only]
  windowEmbedViewRef: EmbeddedViewRef<FuiModalWindowTemplateContext>; // [Internal use only]
  hasChildWindowOpen: boolean; // [Internal use only]
  isSubmitting: boolean; // Whether the user has submitted the window or not. Default to false.
  isCanceling: boolean; // Whether the user has cancelled the window or not. Default to false.
  isGoingNext: boolean; // Whether the user is going on the next screen or not. Default to false.
  isGoingBack: boolean; // Whether the user is going on the previous screen or not. Default to false.
  childWindowLeftValue: { [key: string]: string }; // [Internal use only]
  defaultLeftValue: number; // [Internal use only]
  closeConfirm: boolean; // Whether we want a close confirmation or not. Default to false.

  // Optionals attributes.
  error?: string | Error; // The error to be displayed on window top body. Default to undefined.
  closeButton?: boolean; // True by default. Whether or not we want to display the close button.
  cssClass?: string; // A space separated string of css classes we want to add to the modal window (for extra customisation)
  id?: string; // The unique ID of the window. If not set, a uniqueID will be generated.
  // Value in px of the window width.
  width?: number; // The developer can specify the custom width if he want, by default we use 600px for standard window and 770px for wizards.
  reset(): void; // [Internal use only]
  openChildWindow<T>(windowId: string, windowPromises?: FuiModalWindowResolve, params?: FuiModalWindowParam): Promise<T>;
  render(viewContainerRef: ViewContainerRef): void; // [Internal use only]
  renderError(viewContainerRef: ViewContainerRef, error: string | Error): void; // [Internal use only]
  renderLoading(viewContainerRef: ViewContainerRef): void; // [Internal use only]
  $close(event: MouseEvent | KeyboardEvent): Promise<CL>; // Close the window.
  $init(args?: any): Promise<I>; // Initialise the window with args.
}`;

  modalExample11: string = `interface FuiModalHeadlessWindowCtrl<
  I = any,
  CL = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalHeadlessWindowScreen, I, CL, P, R> {
  component: Type<FuiModalHeadlessWindowScreen<I, CL>>; // The component screen to use.
}`;

  modalExample12: string = `interface FuiModalStandardWindowCtrl<
  I = any,
  CL = any,
  S = any,
  C = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalStandardWindowScreen<I, CL, S, C>, I, CL, P, R> {
  component: Type<FuiModalStandardWindowScreen<I, CL, S, C>>; // The component screen to use.
  title?: string; // If you want to set a title for your modal
  subtitle?: string; // If you want to set a sub-title for your modal
  // If you want something more complex, like adding an icon or whatever else just provide the titleTemplate.
  // But be careful to ONLY use either \`title\` + \`subtitle\` OR \`titleTemplate\`, only \`titleTemplate\` will be taken into account.
  titleTemplate?: TemplateRef<any>;
  submitButton?: FuiModalButtonInterface; // Custom design for the submitButton. Default label to 'Submit'
  cancelButton?: FuiModalButtonInterface; // Custom design for the cancelButton. Default label to 'Cancel'
  withSubmitBtn?: boolean; // True by default. Whether or not we want to display the submit button.
  withCancelBtn?: boolean; // False by default. Whether or not we want to display the cancel button.
  $submit?(event: MouseEvent): Promise<S | CL>; // Submit the window workflow.
  $cancel?(event: MouseEvent): Promise<C | CL>; // Cancel the window workflow.
}`;

  modalExample13: string = `interface FuiModalWizardWindowCtrl<
  I = any,
  CL = any,
  N = any,
  B = any,
  S = any,
  C = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalWizardWindowScreen<I, CL, N, B, S, C>, I, CL, P, R> {
  title?: string; // If you want to set a title for your modal
  subtitle?: string; // If you want to set a sub-title for your modal
  // If you want something more complex, like adding an icon or whatever else just provide the titleTemplate.
  // But be careful to ONLY use either \`title\` + \`subtitle\` OR \`titleTemplate\`, only \`titleTemplate\` will be taken into account.
  titleTemplate?: TemplateRef<any>;
  submitButton?: FuiModalButtonInterface; // Custom design for the submitButton. Default label to 'Submit'
  cancelButton?: FuiModalButtonInterface; // Custom design for the cancelButton. Default label to 'Cancel'
  withSubmitBtn?: boolean; // True by default. Whether or not we want to display the submit button.
  withCancelBtn?: boolean; // False by default. Whether or not we want to display the cancel button.
  // Wizard specific
  wizardSteps: FuiWizardStepConfiguration[]; // List of all steps.
  currentStepIndex: number; // This will give you the index of the current step.
  backButton?: FuiModalButtonInterface; // Custom design for the backButton. Default label to 'Back'
  nextButton?: FuiModalButtonInterface; // Custom design for the nextButton. Default label to 'Next'
  withNextBtn?: boolean; // True by default. Whether or not we want to display the next button.
  withBackBtn?: boolean; // True by default. Whether or not we want to display the back button.
  $submit?(event: MouseEvent): Promise<S | CL>; // Submit the window workflow.
  $cancel?(event: MouseEvent): Promise<C | CL>; // Cancel the window workflow.
  $back?(event: MouseEvent, stepIndex?: number): Promise<B>; // Go to previous step.
  $next?(event: MouseEvent): Promise<N>; // Go to next step.
}`;
}
