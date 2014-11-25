$(function() {


	/*
	 * Log click
	 */
	$('a[rel="log"], a[rel="log-close"]').click(function(e) {
		e.preventDefault();

		// Show the log
		$('#log').slideToggle();
	});


	/*
	 * Title click
	 */
	$(document.body).on('click', '.b-title', function(e) {
		// Close all currently open panels
		close_all();

		// If this status is not already visible
		if( ! $(this).hasClass('active')) {

			// Get the backup id
			var b_id = $(this).attr('id').substr(4);

			// Show the status with id
			$('#b-s-' + b_id).fadeIn();

			$(this).addClass('active');
		}
	});


	/*
	 * Panel click
	 */
	$(document.body).on('click', 'a[rel="edit"], a[rel="actions"]', function(e) {
		e.stopPropagation();

		// Close all currently open panels
		close_all();

		// Title element
		var b_title = $(this).parents('.b-title');
		// Backup ID
		var b_id = $(this).attr('href').substr(1);
		// Rel method first letter
		var method = $(this).attr('rel').substr(0,1);
	
		b_title.addClass('active');


		// If the method is edit then we'll need to fetch data for the backup
		if(method == 'e') {
			$.get('assets/mst/backup-edit.mustache', function(edit_template) {
				$.get('assets/mst/backup-edit-section.mustache', function(section_template) {
					// Render the template
					var rendered = Mustache.render(edit_template, {
						'sections': lang.backup_edit_sections,
						'b_id': b_id
					},
					{
						'section': section_template,
					});
					
					// Output the template
					$('#b-' + method + '-' + b_id).html(rendered);
				});
			});
		}

		// Show the status
		$('#b-s-' + b_id).show(0, function(){

			// Show the operation / edit section
			$('#b-' + method + '-' + b_id).slideDown();
		});
	});


	/*
	 * Section click
	 */
	$(document.body).on('click', 'a[rel="section"]', function(e) {
		e.stopPropagation();

		// Close all currently open sections
		close_sections();
		
		// Get the requested section id
		var p_id = $(this).attr('href').substr(1);

		// Show the section with id
		$('#b-' + p_id).slideDown();

		// Hide the trigger element
		$(this).hide();
	});


	/**
	 * Close all currently open sections
	 */
	function close_sections() {
		$('.b-section:visible').each(function() {
			// Hide the section
			$('#' + $(this).attr('id')).slideUp();

			// Show the trigger element
			$('#' + $(this).attr('id') + '-trigger').slideDown();
		});
	}


	/**
	 * Close all currently open .b-status, .b-edit, b-actions
	 */
	function close_all(type) {
		if(type) {
			$('.b-' + type).hide();
		}
		else {
			$('.b-status, .b-actions, .b-edit').hide();
			$('.b-title').removeClass('active');
		}
	}

});