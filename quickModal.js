/* exported QuickModal */

/**
 * QuickModal class used for the QuickModal plugin
 */
class QuickModal{
	/**
	 * Creates an instance of QuickModal
	 * @param {Object|String}           parameters                         Parameters holder. Use a String if you want a quick initialization
	 * @param {Boolean}                 [parameters.darkenBackground=true] Should the QuickModal darken the background when shown?
     * @param {Boolean}                 [parameters.isForm=true]           Is the QuickModal a form?
     * @param {Boolean}                 [parameters.keepHidden=false]      Keep the modal hidden instead of destroying it
     * @param {Object}                  [parameters.form]                  Form properties holder
     * @param {String}                  [parameters.form.action]           Form URL
     * @param {String}                  [parameters.form.method]           Form METHOD attribute (GET/POST/...)
     * @param {String}                  [parameters.form.id]               Form ID
     * @param {String[]}                [parameters.form.classes]          Form classes
     * @param {String}                  [parameters.form.submit]           Form submit button text
     * @param {String}                  [parameters.closeText=OK]          Close button text
     * @param {String[]}                [parameters.classes]               QuickModal classes
     * @param {Object<String, String>}  [parameters.attributes]            QuickModal attributes
     * @param {String}                  parameters.header                  Header content
     * @param {Object[]}                parameters.body                    Body content
     * @param {Object[]}                parameters.footer                  Footer content
     * @param {Document}                [parameters.document]              Document in which the QuickModal should be opened into, window.document is used by default
     * @param {Function}                [parameters.afterOpen]             Callback called after the QuickModal gets displayed
     * @param {Function}                [parameters.beforeClose]           Callback called before the QuickModal closes
     * @param {Function}                [parameters.onSubmit]              Callback called when the QuickModal form gets submitted
	 * @param {String}                  [body]                             Body content if you want a quick initialization
	 */
	constructor(parameters, body){
		/**
		 * Parameters to initialize the QuickModal with
		 * @private
		 */
		this._parameters = {
			darkenBackground: true,
			isForm: true,
			keepHidden: false,
			form: {
				action: 'path/to/your/form',
				method: 'POST',
				id: 'formId',
				classes: [],
				submit: 'OK'
			},
			closeText: 'OK',
			classes: [],
			attributes: {},
			header: '<div>QuickModal</div>',
			body: [
				{
					type: 'text',
					text: 'This is a basic QuickModal. See the <a href="https://zenoo.github.io/quickModal/">documentation</a> for more.',
					tag: 'p',
					classes: []
				}
			],
			footer: [],
			document: window.document,
			afterOpen: () => {},
			beforeClose: () => {},
			onSubmit: () => {}
		};

		// Initializer shorthand
		if(typeof parameters == 'string'){
			this._parameters = {
				...this._parameters,
				isForm: false,
				header: '<div>' + parameters + '</div>',
				body: [
					{
						type: 'text',
						text: body,
						tag: 'p',
						classes: []
					}
				],
				footer: []
			};
		}else{
			this._parameters = {
				...this._parameters,
				...parameters
			};
		}

		/**
		 * This ID is unique at the time it's accessed
		 */
		this.id = 0;
		while(this._parameters.document.getElementById('quick-modal-' + this.id)) this.id++;
		
		/**
		 * QuickModal elements holder
		 * @type {Object.<String, Element>}
		 * @private
		 */
		this._elements = {
			hider: null,
			body: null,
			footerLinks: null
		};

		this._build();

		this._listen();

		// Show the QuickModal
		this.open();
	}

	/**
	 * Builds the QuickModal in the DOM
	 * @private
	 */
	_build(){
		this._buildFrame();

		// Hider
		if(this._parameters.darkenBackground){
			this._elements.hider = this._parameters.document.createElement('div');
			this._elements.hider.id = 'quick-modal-hider-' + this.id;
			this._elements.hider.classList.add('quick-modal-hider');

			this._parameters.document.body.appendChild(this._elements.hider);
		}

		this._buildBody(this._elements.body, this._parameters.body);

		this._buildFooter();

		this._parameters.document.body.append(this.modal);
	}

	/**
	 * Build the QuickModal frame
	 * @private
	 */
	_buildFrame(){
		// QuickModal wrapper
		this.modal = this._parameters.document.createElement('section');
		this.modal.id = 'quick-modal-' + this.id;
		this.modal.classList.add('quick-modal', ...this._parameters.classes);
		Object.entries(this._parameters.attributes).forEach(([attribute, value]) => {
			this.modal.setAttribute(attribute, value);
		});

		// QuickModal base DOM tree
		this.modal.innerHTML = `
			${this._parameters.isForm ? `
				<form 
					${Reflect.ownKeys(this._parameters.form).includes('id') ? 'id="'+this._parameters.form.id+'"' : ''}
					action="${Reflect.ownKeys(this._parameters.form).includes('action') ? this._parameters.form.action : '#'}"
					method="${Reflect.ownKeys(this._parameters.form).includes('method') ? this._parameters.form.method : 'POST'}"
				>
			` : ''}
			<header>
				${this._parameters.header}
				<aside class="quick-modal-close">x</aside>
			</header>
			<section class="quick-modal-main">

			</section>
			<footer>
				<ul>
					${this._parameters.isForm ? `
						<li>
							<input 
								type="submit" 
								class="quick-modal-generated-btn quick-modal-submit" 
								value="${Reflect.ownKeys(this._parameters.form).includes('submit') ? this._parameters.form.submit : 'OK'}"
							/>
						</li>
					` : ''}
					<li>
						<a class="quick-modal-generated-btn quick-modal-close" href="">
							${this._parameters.closeText}
						</a>
					</li>
				</ul>
			</footer>
			${this._parameters.isForm ? '</form>' : ''}
		`;

		this._elements.body = this.modal.querySelector('.quick-modal-main');
		this._elements.footerLinks = this.modal.querySelector('footer>ul');
	}

	/**
	 * Build the QuickModal body
	 * @param {Element} parent    Parent element
	 * @param {Object[]} children Children objects to build & append to the parent
	 * @private
	 */
	_buildBody(parent, children){
		children.forEach(line => {
			const lineAttributes = Reflect.ownKeys(line);

			if(line.type == 'text'){
				/** @const {Element} */
				const element = this._parameters.document.createElement(line.tag);

				element.innerHTML = line.text;
				if(lineAttributes.includes('id')) element.id = line.id;
				if(lineAttributes.includes('classes')) element.classList.add(...line.classes);
				if(lineAttributes.includes('attributes')){
					Object.entries(line.attributes).forEach(([attribute, value]) => {
						element.setAttribute(attribute, value);
					});
				}

				parent.appendChild(element);
			}else if(line.type == 'form'){
				switch (line.tag) {
					case 'select':
						parent.append(...this._toNodes(`
							<p>
								${lineAttributes.includes('label') ? `
									<label for="${lineAttributes.includes('id') ? line.id : line.name}">${line.label}</label>
								` : ''}
								<${line.tag} 
									name="${lineAttributes.includes('name') ? line.name : ''}" 
									id="${lineAttributes.includes('id') ? line.id : line.name}"
									class="${lineAttributes.includes('classes') ? line.classes.join(' ') : ''}"
									${lineAttributes.includes('attributes')
										? Object.entries(line.attributes).reduce((acc, [attribute, value]) => acc += attribute + '="'+value+'" ', '')
										: ''
									}
								>
									${line.options.reduce((acc, option) => acc += `
										<option 
											${Reflect.ownKeys(option).includes('attributes')
												? Object.entries(option.attributes).reduce((accu, [attribute, value]) => accu += attribute + '="'+value+'" ', '')
												: ''
											}
											value="${option.value}"
											${option.selected ? 'selected' : ''}
										>
											${option.text}
										</option>
									`, '')}
								</${line.tag}>
							</p>
						`));
						break;
					default:
						parent.append(...this._toNodes(`
							${lineAttributes.includes('inputType') && line.inputType == 'hidden' ? '' : '<p>'}
								${lineAttributes.includes('label') ? `
									<label for="${lineAttributes.includes('id') ? line.id : line.name}">${line.label}</label>
								` : ''}
								<${line.tag} 
									${line.tag == 'textarea' ? '' : lineAttributes.includes('inputType') ? 'type="'+line.inputType+'"' : ''}
									name="${lineAttributes.includes('name') ? line.name : ''}" 
									id="${lineAttributes.includes('id') ? line.id : line.name}"
									class="${lineAttributes.includes('classes') ? line.classes.join(' ') : ''}"
									${lineAttributes.includes('attributes')
										? Object.entries(line.attributes).reduce((acc, [attribute, value]) => acc += attribute + '="'+value+'" ', '')
										: ''
									}
									placeholder="${lineAttributes.includes('placeholder') ? line.placeholder : ''}"
									value="${lineAttributes.includes('value') ? line.value : ''}"
								></${line.tag}>
							${lineAttributes.includes('inputType') && line.inputType == 'hidden' ? '' : '</p>'}
						`));
						break;
				}
			}else{
				console.warn(line);
				console.warn('QuickModal: The above element has an invalid `type` attribute. It has been ignored.');
			}

			// Display recursive children
			if(line.children){
				this._buildBody(parent.lastElementChild, line.children);
			}
		});
	}

	/**
	 * Build the QuickModal footer
	 * @private
	 */
	_buildFooter(){
		this._parameters.footer.forEach(link => {
			const linkAttributes = Reflect.ownKeys(link);

			this._elements.footerLinks.prepend(...this._toNodes(`
				<li
					id="${linkAttributes.includes('id') ? link.id : ''}"
					class="${linkAttributes.includes('classes') ? link.classes.join(' ') : ''}"
					${linkAttributes.includes('attributes')
						? Object.entries(link.attributes).reduce((acc, [attribute, value]) => acc += attribute + '="'+value+'" ', '')
						: ''
					}
				>
					<a class="quick-modal-generated-btn" href="${link.href}">
						${link.text}
					</a>
				</li>
			`));
		});
	}

	/**
	 * Attach event listeners for the QuickModal
	 * @private
	 */
	_listen(){
		// Close action handling
		const closingHandler = e => {
			e.preventDefault();
			if(this._parameters.keepHidden){
				this.close();
			}else{
				this.destroy();
			}
		};

		if(this._parameters.darkenBackground) this._elements.hider.addEventListener('click', closingHandler);

		this.modal.querySelectorAll('.quick-modal-close').forEach(button => {
			button.addEventListener('click', closingHandler);
		});

		// Submit action handling
		if(this._parameters.isForm){
			const form = this.modal.querySelector('form');

			form.addEventListener('submit', e => {
				// Callback onSubmit
				Reflect.apply(this._parameters.onSubmit, this, [e, form]);
			});
		}
	}

	/**
	 * Converts an HTML String to a NodeList
	 * @param {String} html String representing the HTML to convert
	 * @return {NodeList}
	 * @private
	 */
	_toNodes(html){
		const template = this._parameters.document.createElement('template');

		template.innerHTML = html;

		return template.content.childNodes;
	}

	/**
	 * Opens the QuickModal
	 * @returns {Promise} A promise resolved once the QuickModal is fully displayed
	 */
	open(){
		setTimeout(() => {
			this.modal.classList.remove('done');
			this.modal.classList.add('active');

			if(this._parameters.darkenBackground){
				this._elements.hider.classList.remove('done');
				this._elements.hider.classList.add('active');
			}

			// Callback afterOpen
			Reflect.apply(this._parameters.afterOpen, this, [this.modal]);
		}, 20);

		return new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 500);
		});
	}

	/**
	 * Closes the QuickModal
	 * @returns {Promise} A promise resolved once the QuickModal is fully hidden
	 */
	close(){
		// Callback beforeClose
		Reflect.apply(this._parameters.beforeClose, this, [this.modal]);

		this.modal.classList.remove('active');
		if(this._parameters.darkenBackground) this._elements.hider.classList.remove('active');

		return new Promise(resolve => {
			setTimeout(() => {
				this.modal.classList.add('done');
				if(this._parameters.darkenBackground) this._elements.hider.classList.add('done');
				resolve();
			}, 500);
		});
	}

	/**
	 * Removes any QuickModal mutation from the DOM
	 */
	destroy(){
		this.close().then(() => {
			this.modal.remove();
			if(this._parameters.darkenBackground) this._elements.hider.remove();
		});
	}

	/**
	 * Removes any QuickModal mutation from the DOM
	 * @param {Integer} id The targeted QuickModal id
	 */
	static destroy(id){
		const modal = document.getElementById('quick-modal-' + id);

		if(modal){
			modal.querySelector('.quick-modal-close').dispatchEvent(new Event('click'));

			setTimeout(() => {
				const hider = document.getElementById('quick-modal-hider-' + id);

				modal.remove();
				if(hider) hider.remove();
			}, 500);
		}
	}
}

if(window.jQuery){
	// Equivalent jQuery plugin
	(function($){
		'use strict';
	
			$.fn.extend({
					quickModal(parameters) {
				console.warn('QuickModal: Using `$(...).quickModal(...)` is deprecated. Use `const modal = new QuickModal(...)` instead.');
	
				const modal = new QuickModal(parameters);
	
				this.open = () => {
					modal.open();
				};
	
				this.close = () => {
					modal.close();
				};
	
				this.destroy = () => {
					modal.destroy();
				};
				
				return this;
			}
			});
	}(jQuery));
}