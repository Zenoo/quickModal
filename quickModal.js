(function($){
    $.fn.extend({
        quickModal: function(options) {
            this.defaultOptions = {
                darkenBackground: true,
                isForm: true,
                closeText: 'Close',
                classes: [],
                attributes: {
                    'data-modal': 'true'
                },
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
                        ],
                        attributes: {}
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
                        ],
                        attributes: {}
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
                        ],
                        attributes: {
                            'data-modal': 'true'
                        },
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
                        ],
                        attributes: {}
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
                afterOpen: function(modal) {},
                beforeClose: function(modal) {},
                onSubmit: function(form) {}
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
                if(settings.isForm) $(document).off('submit','#quick-modal-'+that.quickModalId+' form');
            };
            
            if(settings.darkenBackground){
            	$('body').append(`<div id="quick-modal-hider-`+this.quickModalId+`" class="quick-modal-hider"></div>`);
            }
            
            var modal = $(`
            	<section id="quick-modal-`+this.quickModalId+`" class="quick-modal">
                	`+(settings.isForm ? '<form '+('id' in settings.form ? 'id="'+settings.form.id+'"' : '')+' action="'+(settings.form.action != undefined ? settings.form.action : '#')+'" method="'+(settings.form.method != undefined ? settings.form.method : 'POST')+'">' : '')+`
                	<header>
                    	`+settings.header+`
                        <aside><i class="fa fa-close fa-times quick-modal-close" aria-hidden="true"></i></aside>
                    </header>
                    <section class="quick-modal-main">
                    
                    </section>
                    <footer>
                    	<ul>
                        	`+(settings.isForm ? 
                            	'<li><input type="submit" class="quick-modal-generated-btn quick-modal-submit" value="'+(settings.form.submit != undefined ? settings.form.submit : 'OK')+'" /></li><li><a class="quick-modal-generated-btn quick-modal-close" href="">'+settings.closeText+'</a></li>' : 
                                '<li><a class="quick-modal-generated-btn quick-modal-close" href="">'+settings.closeText+'</a></li>'
                            )+`
                        </ul>
                    </footer>
                    `+(settings.isForm ? '</form>' : '')+`
                </section>
            `);
            
            if('classes' in settings) for(let clazz of settings.classes) modal.addClass(clazz);
            
            if('attributes' in settings) for(let k in settings.attributes) if(settings.attributes.hasOwnProperty(k)) modal.attr(k,settings.attributes[k]);
            
            $.each(settings.body,function(k,line){
            	var html;
                
                if(line.type == 'text'){
                    html = $('<'+line.tag+'>'+line.text+'</'+line.tag+'>');
                    
                    if('id' in line) html.attr('id',line.id);
                    if('attributes' in line) for(let k in line.attributes) if(line.attributes.hasOwnProperty(k)) html.attr(k,line.attributes[k]);
                    if('classes' in line) for(let clazz of line.classes) html.addClass(clazz);
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
                            if('classes' in line) for(let clazz of line.classes) $(line.tag,html).addClass(clazz);
                            
                            if('attributes' in line) for(let k in line.attributes) if(line.attributes.hasOwnProperty(k)) $(line.tag,html).attr(k,line.attributes[k]);
                            
                        	$.each(line.options,function(k,option){
                                var attributesToAdd = '';
                            if('attributes' in option) for(let k in option.attributes) if(option.attributes.hasOwnProperty(k)) attributesToAdd +=k+'="'+option.attributes[k]+'"';
                                
                            	$(line.tag,html).append('<option '+attributesToAdd+' value="'+option.value+'" '+(option.selected ? 'selected' : '')+'>'+option.text+'</option>');
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
                            if('classes' in line) for(let clazz of line.classes) $(line.tag,html).addClass(clazz);
                            
                            if('attributes' in line) for(let k in line.attributes) if(line.attributes.hasOwnProperty(k)) $(line.tag,html).attr(k,line.attributes[k]);
                            
                            if('placeholder' in line) $(line.tag,html).attr('placeholder',line.placeholder);
                            if('value' in line) $(line.tag,html).val(line.value);
                        	break;
                        default:
                            if(line.inputType == 'hidden'){
                               html = $('<'+line.tag+' name="'+line.name+'" />');
                                
                                if('id' in line) $(html).attr('id',line.id);
                                if('classes' in line) for(let clazz of line.classes) $(html).addClass(clazz);
                                
                                if('attributes' in line) for(let k in line.attributes) if(line.attributes.hasOwnProperty(k)) html.attr(k,line.attributes[k]);

                                if('placeholder' in line) $(html).attr('placeholder',line.placeholder);
                                if('inputType' in line) $(html).attr('type',line.inputType);
                                if('value' in line) $(html).val(line.value);
                            }
                            else{
                                if('label' in line){
                                    if('inputType' in line && line.inputType == 'checkbox'){
                                        html = $('<p><'+line.tag+' name="'+line.name+'" /><label for="'+line.name+'" '+('inputType' in line ? 'class="type-'+line.inputType+'"' : '')+'>'+line.label+'</label></p>');
                                    }else{
                                        html = $('<p><label for="'+line.name+'" '+('inputType' in line ? 'class="type-'+line.inputType+'"' : '')+'>'+line.label+'</label><'+line.tag+' name="'+line.name+'" /></p>');
                                    }
                                }
                                else{
                                    html = $('<p><'+line.tag+' name="'+line.name+'" /></p>');
                                }
                                
                                if('id' in line) $(line.tag,html).attr('id',line.id);
                                if('classes' in line) for(let clazz of line.classes) $(line.tag,html).addClass(clazz);
                                
                                if('attributes' in line) for(let k in line.attributes) if(line.attributes.hasOwnProperty(k)) $(line.tag,html).attr(k,line.attributes[k]);

                                if('placeholder' in line) $(line.tag,html).attr('placeholder',line.placeholder);
                                if('inputType' in line) $(line.tag,html).attr('type',line.inputType);
                                if('value' in line) $(line.tag,html).val(line.value);
                            }
                            
                            
                        	
                    }
                }
                
                $('.quick-modal-main',modal).append(html);
            });
            
            $.each(settings.footer,function(k,link){
            	var li = $('<li><a class="quick-modal-generated-btn" href="'+link.href+'">'+link.text+'</a></li>');
                if('id' in link) li.attr('id',link.id);
                if('classes' in link) for(let clazz of link.classes) li.find('a').addClass(clazz);
                if('attributes' in link) for(let k in link.attributes) if(link.attributes.hasOwnProperty(k)) li.attr(k,link.attributes[k]);
                
                if($('footer ul li a.quick-modal-generated-btn.quick-modal-close', modal).length) $('footer ul li a.quick-modal-generated-btn.quick-modal-close', modal).parent().before(li);
                else $('footer ul li input.quick-modal-generated-btn.quick-modal-submit', modal).parent().before(li);
            });
            
            $('body').append(modal);
            setTimeout(function(){
            	modal.addClass('active');
                $('#quick-modal-hider-'+that.quickModalId).addClass('active');
            },20);
            
            settings.afterOpen.call(undefined,modal);
            
            $(document).on('click','#quick-modal-hider-'+this.quickModalId+',#quick-modal-'+this.quickModalId+' .quick-modal-close',function(e){
                e.preventDefault();
            	settings.beforeClose.call(undefined,$('#quick-modal-'+that.quickModalId));
                $('#quick-modal-'+that.quickModalId+',#quick-modal-hider-'+that.quickModalId).removeClass('active').addClass('done');
                
                setTimeout(function(){
                	$('#quick-modal-'+that.quickModalId+',#quick-modal-hider-'+that.quickModalId).remove();
                    that.destroy();
                },2000);
            });
            
            if(settings.isForm){
                $(document).on('submit','#quick-modal-'+that.quickModalId+' form',function(e){
                    settings.onSubmit.call(undefined,e,$(this));
                });
            }
            
            return this;
        }
    });
})(jQuery);
