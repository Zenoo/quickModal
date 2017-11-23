(function($){
    $.fn.extend({
        quickModal: function(options) {
            this.defaultOptions = {
                darkenBackground: true,
                isForm: true,
                closeText: 'Close',
                form: {
                	action: 'path/to/your/form',
                    method: 'POST',
                    id: 'formId',
                    submit: 'OK'
                },
                header: '<div>Custom HTML</div>',
                body: [
                	{
                    	type: 'text',
                        text: 'I am Text !',
                        tag: 'h3',
                        id: 'myId',
                        classes: [
                        	'class1',
                            'class2'
                        ]
                    },
                    {
                    	type: 'form',
                        label: 'I am Input !',
                        inputType: 'text',
                        placeholder: 'I am Placeholder !',
                        name: 'formText',
                        value: 'currentValue',
                        tag: 'input',
                        id: 'myInput',
                        classes: [
                        	'class1',
                            'class2'
                        ]
                    },
                    {
                    	type: 'form',
                        label: 'I am Textarea !',
                        placeholder: 'I am Placeholder !',
                        name: 'formTextarea',
                        value: 'currentValue',
                        tag: 'textarea',
                        id: 'myTextarea',
                        classes: [
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
                        options: [
                        	{value: 'val', text: 'Option 1', selected: false},
                            {value: 'val2', text: 'Option 2', selected: true}
                        ]
                    }
                ],
                footer: [
                	{
                        text: 'I am Link !',
                        href: 'path/to/link',
                        id: 'myLink',
                        classes: [
                        	'class1',
                            'class2'
                        ]
                    }
                ],
                afterOpen: function(none, modal) {},
                beforeClose: function(none, modal) {},
                onSubmit: function(none, form) {}
            };

            var settings = $.extend({}, this.defaultOptions, options);
            
            var that = this;
			
            this.quickModalId = 0;
            while($('#quick-modal-'+this.quickModalId).length != 0){
            	this.quickModalId++;
            }
            
            this.destroy = function(){
            	$('#quick-modal-'+that.quickModalId+' .quick-modal-close').trigger('click');
                $(document).off('click','#quick-modal-hider-'+that.quickModalId+',#quick-modal-'+that.quickModalId+' .quick-modal-close');
            };
            
            if(settings.darkenBackground){
            	$('body').append(`<div id="quick-modal-hider-`+this.quickModalId+`" class="quick-modal-hider"></div>`);
            }
            
            var modal = $(`
            	<section id="quick-modal-`+this.quickModalId+`" class="quick-modal">
                	`+(settings.isForm ? '<form '+('id' in settings.form ? settings.form.id : '')+' action="'+settings.form.action+'" method="'+settings.form.method+'">' : '')+`
                	<header>
                    	`+settings.header+`
                        <aside><i class="fa fa-close quick-modal-close" aria-hidden="true"></i></aside>
                    </header>
                    <section class="quick-modal-main">
                    
                    </section>
                    <footer>
                    	<ul>
                        	`+(settings.isForm ? 
                            	'<li><input type="submit" class="quick-modal-generated-btn quick-modal-submit" value="'+settings.form.submit+'" /></li>' : 
                                '<li><a class="quick-modal-generated-btn quick-modal-close" href="">'+settings.closeText+'</a></li>'
                            )+`
                        </ul>
                    </footer>
                    `+(settings.isForm ? '</form>' : '')+`
                </section>
            `);
            
            $.each(settings.body,function(k,line){
            	var html;
                
                if(line.type == 'text'){
                    html = $('<'+line.tag+'>'+line.text+'</'+line.tag+'>');
                    
                    if('id' in line) html.attr('id',line.id);
                    if('classes' in line) for(var theClass in line.classes) html.addClass(theClass);
                }else if(line.type == 'form'){
                    switch(line.tag){
                    	case 'select':
                        	if('label' in line){
                                html = $('<p><label for="'+line.name+'">'+line.label+'</label><'+line.tag+' name="'+line.name+'"></'+line.tag+'></p>');
                            }
                            else{
                                html = $('<p><'+line.tag+' name="'+line.name+'"></'+line.tag+'></p>');
                            }
                            
                            if('id' in line) $(line.tag,html).attr('id',line.id);
                            if('classes' in line) for(var theClass in line.classes) $(line.tag,html).addClass(theClass);
                            
                        	$.each(line.options,function(k,option){
                            	$(line.tag,html).append('<option value="'+option.value+'" '+(option.selected ? 'selected' : '')+'>'+option.text+'</option>');
                            });
                        	break;
                        case 'textarea':
                            if('label' in line){
                                html = $('<p><label for="'+line.name+'">'+line.label+'</label><'+line.tag+' name="'+line.name+'"></'+line.tag+'></p>');
                            }
                            else{
                                html = $('<p><'+line.tag+' name="'+line.name+'"></'+line.tag+'></p>');
                            }
                            
                            if('id' in line) $(line.tag,html).attr('id',line.id);
                            if('classes' in line) for(var theClass in line.classes) $(line.tag,html).addClass(theClass);
                            
                            if('placeholder' in line) $(line.tag,html).attr('placeholder',line.placeholder);
                            if('value' in line) $(line.tag,html).val(line.value);
                        	break;
                        default:
                            if(line.inputType == 'hidden'){
                               html = $('<'+line.tag+' name="'+line.name+'" />');
                                
                                if('id' in line) $(html).attr('id',line.id);
                                if('classes' in line) for(var theClass in line.classes) $(html).addClass(theClass);

                                if('placeholder' in line) $(html).attr('placeholder',line.placeholder);
                                if('inputType' in line) $(html).attr('type',line.inputType);
                                if('value' in line) $(html).val(line.value);
                            }
                            else{
                                if('label' in line){
                                    html = $('<p><label for="'+line.name+'">'+line.label+'</label><'+line.tag+' name="'+line.name+'" /></p>');
                                }
                                else{
                                    html = $('<p><'+line.tag+' name="'+line.name+'" /></p>');
                                }
                                
                                if('id' in line) $(line.tag,html).attr('id',line.id);
                                if('classes' in line) for(var theClass in line.classes) $(line.tag,html).addClass(theClass);

                                if('placeholder' in line) $(line.tag,html).attr('placeholder',line.placeholder);
                                if('inputType' in line) $(line.tag,html).attr('type',line.inputType);
                                if('value' in line) $(line.tag,html).val(line.value);
                            }
                            
                            
                        	
                    }
                }
                
                $('.quick-modal-main',modal).append(html);
            });
            
            $.each(settings.footer,function(k,link){
            	var li = $('<li><a href="'+link.href+'">'+link.text+'</a></li>');
                if('id' in link) li.attr('id',link.id);
                if('classes' in link) for(var theClass in link.classes) li.addClass(theClass);
                
            	$('footer ul li a.quick-modal-generated-btn', modal).parent().before(li);
            });
            
            $('body').append(modal);
            setTimeout(function(){
            	modal.addClass('active');
                $('#quick-modal-hider-'+that.quickModalId).addClass('active');
            },20);
            
            settings.afterOpen.call(undefined,modal);
            
            $(document).on('click','#quick-modal-hider-'+this.quickModalId+',#quick-modal-'+this.quickModalId+' .quick-modal-close',function(){
            	settings.beforeClose.call(undefined,$('#quick-modal-'+that.quickModalId));
                $('#quick-modal-'+that.quickModalId+',#quick-modal-hider-'+that.quickModalId).removeClass('active').addClass('done');
                
                setTimeout(function(){
                	$('#quick-modal-'+that.quickModalId+',#quick-modal-hider-'+that.quickModalId).remove();
                },2000);
            });
            
            return this;
        }
    });
})(jQuery);
