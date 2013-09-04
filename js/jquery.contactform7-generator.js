(function($) {

    /**
    * Generate input form
    *
    * @param (null / object / string) command or settings
    */
    $.fn.CF7Generator = function(options) {
        var options = handleArguments(options);
        var settings = $.extend({
            field_count : 30, //Number of fields to generate
            form_result : "#form_result", //Where to return Form HTML
            message_result : "#message_result", //Where to return message Text
            field_wrapper: "<p>"
        }, options);
        this.each( function() {
            //
            console.log('create form + fields table');
            CF7GeneratorCreateForm(this,settings);
        });
    }

    function CF7GeneratorCreateForm(element,settings){
        //$(element).html("test");
        //Form Wrapper
        var formElement = $('<form>');
        //Button
        var generateButton = $('<p><button type="button" class="btn btn-primary btn-large generate-button">Generate</button><p>');
        formElement.append(generateButton);
        //Table
        var fieldTable = $('<table class="table table-hover table-bordered">');
        //Table Header
        var fieldTableHeaders = $('<thead>').append('<tr>');
        $('tr',fieldTableHeaders).append('<th>Label</th>');
        $('tr',fieldTableHeaders).append('<th>Name</th>');
        $('tr',fieldTableHeaders).append('<th>Type</th>');
        $('tr',fieldTableHeaders).append('<th>Options</th>');
        $('tr',fieldTableHeaders).append('<th>Required</th>');
        //Add headers to table
        fieldTable.append(fieldTableHeaders);
        //Table Body
        var fieldTableBody = $('<tbody>');
        for(var i=0; i<settings.field_count;i++){
            fieldTableBodyRow = $('<tr>');
            //add each field
            //label
            fieldTableBodyRow.append('<td><input type="text" class="input-block-level" name="label'+i+'" /></td>');
            //name
            fieldTableBodyRow.append('<td><input type="text" class="input-block-level" name="name'+i+'" placeholder="Leave Blank" /></td>');
            //select
            fieldTypeSelectCell = $('<td>');
            fieldTypeSelect = $('<select class="input-block-level" name="type'+i+'">');
            fieldTypeSelect.append('<option value="text">Text Field</option>');
            fieldTypeSelect.append('<option value="email">Email</option>');
            fieldTypeSelect.append('<option value="textarea">Text Area</option>');
            fieldTypeSelect.append('<option value="select">Select Menu</option>');
            fieldTypeSelect.append('<option value="checkbox">Checkboxes</option>');
            fieldTypeSelect.append('<option value="radio">Radio Buttons</option>');
            fieldTypeSelectCell.append(fieldTypeSelect);
            fieldTableBodyRow.append(fieldTypeSelectCell);
            //options
            fieldTableBodyRow.append('<td><input type="text" class="input-block-level" name="options'+i+'" placeholder="Option 1 | Option2 | Option3" /></td>');
            //required
            fieldTypeRequiredCell = $('<td>');
            fieldTypeRequired = $('<select class="input-block-level" name="required'+i+'">');
            fieldTypeRequired.append('<option value="1">Yes</option>');
            fieldTypeRequired.append('<option value="0">No</option>');
            fieldTypeRequiredCell.append(fieldTypeRequired);
            fieldTableBodyRow.append(fieldTypeRequiredCell);
            //add to body
            fieldTableBody.append(fieldTableBodyRow);
        }
        //Add body to table
        fieldTable.append(fieldTableBody);
        //Add table to form
        formElement.append(fieldTable);
        //Write output
        $(element).html(formElement);
        //Setup listener on button
        $('.generate-button',element).click(function(){
            CF7GeneratorOutput(element,settings);
        });
    }

    function CF7GeneratorOutput(element,settings){
        var formOutputLines = new Array();
        var messageOutputLines = new Array();
        //alert(element);
        for(var i=0;i<settings.field_count;i++){
            var field = {
                label: $.trim($('input[name="label'+i+'"]',element).val()),
                name: $.trim($('input[name="name'+i+'"]',element).val()),
                type: $.trim($('select[name="type'+i+'"]',element).val()),
                options: $.trim($('input[name="options'+i+'"]',element).val()),
                required: $.trim($('select[name="required'+i+'"]',element).val())
            }
            if(field.label || field.name){
                //Generate name if empty
                if(!field.name){
                    field.name = CF7GeneratorCleanName(field.label);
                }
                //Make sure name does not exist already
                //!!!todo
                //Set name in field display
                $('input[name="name'+i+'"]',element).val(field.name);
                //Generate output lines
                formOutputField = CF7GeneratorFormOutputLine(field);
                messageOutputField = CF7GeneratorMessageOutputLine(field);
                //Add to full output
                formOutputLine = $(settings.field_wrapper);
                formOutputLine.append(formOutputField);
                formOutputLines[formOutputLines.length] = formOutputLine[0].outerHTML;
                messageOutputLines[messageOutputLines.length] = messageOutputField;
            }
        }
        formOutput = formOutputLines.join("\n");
        messageOutput = messageOutputLines.join("\n");
        //Add to display
        $(form_result).html(formOutput);
        $(message_result).html(messageOutput);
    }

    function CF7GeneratorFormOutputLine(field){
        var output = '';
        //label
        if(field.label){
            output += '<label>'+field.label+'</label>';
        }
        //space
        output += "\n";
        //field
        var r = '';
        if(field.required == 1){
            r = '*';
        }
        var options = '';
        if(field.options){
            option_array = field.options.split("|");
            for(var j=0; j<option_array.length;j++){
                option_array[j] = '"'+$.trim(option_array[j])+'"';
            }
            options = option_array.join(' ');
        }
        output += '['+field.type+''+r+' '+field.name+' '+options+']';
        //return
        return output;
    }
    
    function CF7GeneratorMessageOutputLine(field){
        var output = '';
        //label
        if(field.label){
            output += field.label+': ';
        }
        //field
        output += '['+field.name+']';
        //return
        return output;
    }

    function CF7GeneratorCleanName(string){
        string = string.toLowerCase();
        string = string.replace(" ","_");
        string = string.replace(/\W/g, '')
        return string;
    }

    /**
    * Return updated options. Detect if option is a string (command) or object
    *
    * @param (object / string) settings data
    * @return (object) settings data
    */
    function handleArguments(options) {
        if (options === undefined || options === null)
        options = {};
        if (options.constructor == String) {
            options = { action: options };
        }
        return options;
    }

}(jQuery));