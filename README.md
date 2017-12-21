# quickModal

Create a custom modal quickly.

### Doc

* **Installation**

Simply import JQuery & quickModal into your HTML.
```
<link rel="stylesheet" type="text/css" href="/path/to/quickModal.css">
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script src="your/Path/js/quickModal.js" type="text/javascript"></script>	
```
* **How to use**

Initialize your modal after any event.
```
var modal;
$('#yourModalTrigger').on('click',function(){
	 modal = $(this).quickModal();
});
```
* **Options**
```
{
  darkenBackground: true, // Darken your page background when the modal is active
  isForm: true, // Your modal contains a form
  closeText: 'Close', // Close button text
  classes: [], //Your modal classes (String array)
  attributes: { //Your modal additional attributes (attribute name : attribute value)
    'data-modal': 'true'
  },
  form: { // If isForm is set to true, this object will define your form properties
      action: 'path/to/your/form', // Form ACTION attribute
      method: 'POST', // Form METHOD attribute
      id: 'formId', // Form ID
      submit: 'OK' // Form Submit text
  },
  header: '<div>Custom HTML</div>', // Modal header content
  body: [ // Array containing all your modal lines
    {
        type: 'text', // Possible values ["text","form"] If set to 'text', creates a simple HTML node
          text: 'I am Text !', // Your line text
          tag: 'h3', // Your line tag
          id: 'myId', // Your line id
          classes: [ // Your line classes
              'class1',
              'class2'
          ],
          attributes: { //Your line additionnal attributes
            'data-modal': 'true'
          }
      },
      {
        type: 'form', // Possible values ["text","form"] If set to 'form', create a new HTML Node with a label and your tag.
          label: 'I am Input !', // Your input label
          inputType: 'text', // If tag == 'input', set this to set your input TYPE attribute
          placeholder: 'I am Placeholder !', // If tag == 'input' or 'textarea', set this to set your input PLACEHOLDER attribute
          name: 'formText', // Your input NAME attribute
          value: 'currentValue', // Your input VALUE attribute
          tag: 'input', // Your input tag
          id: 'myInput', // Your input ID
          classes: [ // Your input classes
            'class1',
              'class2'
          ]
      },
      {
        type: 'form',
          label: 'I am Select !',
          name: 'formSelect',
          tag: 'select',
          id: 'mySelect',
          classes: [
            'class1',
              'class2'
          ],
          options: [ // If tag == 'select', contains your select options
            {
              value: 'val', 
              text: 'Option 1', 
              selected: false,
              attributes: { //Add attributes to your options
                'data-modal': 'true'
              }
            },
            {
              value: 'val2', 
              text: 'Option 2', 
              selected: true
            },
          ]
      }
  ],
  footer: [ // Contains an array of links displayed at the bottom of your modal
    {
          text: 'I am Link !', // Your link text
          href: 'path/to/link', // Your link Href
          id: 'myLink', // Your link ID
          classes: [ // Your link classes
            'class1',
              'class2'
          ]
      }
  ],
  afterOpen: function(modal) {}, // Callback triggered after the modal opens. Parameter is the modal NODE.
  beforeClose: function(modal) {}, // Callback triggered right before the modal closes. Parameter is the modal NODE.
  onSubmit: function(event, form) {} // Callback triggered when the form is submitted. Parameter are the event and the form NODE.
}
```

* **Methods**
```
modal.destroy(); // Destroy your modal instance.
```

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/w4p57wmh/) for a working example
```
var modal;
$('#yourModalTrigger').on('click',function(){
	 modal = $(this).quickModal({
              darkenBackground: true,
              isForm: true,
              closeText: 'Close me !',
              form: {
                  action: '#',
                  method: 'GET',
                  id: 'formId',
                  submit: 'Send me !'
              },
              header: '<div>Beautiful Header</div>',
              body: [
                {
                    type: 'text',
                      text: 'hello there',
                      tag: 'h3',
                      id: 'myId',
                      classes: [
                          'class1',
                          'class2'
                      ]
                  },
                  {
                    type: 'form',
                      label: 'Choose me !',
                      name: 'formSelect',
                      tag: 'select',
                      id: 'mySelect',
                      classes: [
                        'class1',
                          'class2'
                      ],
                      options: [
                        {value: 'val', text: 'You might choose me ?', selected: false},
                          {value: 'val2', text: 'I\'m here by default !', selected: true}
                      ]
                  }
              ],
              footer: [
                {
                      text: 'I\'m a link too !',
                      href: '#',
                      id: 'myLink',
                      classes: [
                          'class1',
                          'class2'
                      ]
                  }
              ],
              afterOpen: function(modal) {
                alert('A modal opened.');
              },
              beforeClose: function(modal) {
                alert('Your closed the modal.');
              },
              onSubmit: function(e,form) {
                alert('You submitted the form.');
              }
    });
});
```

## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
