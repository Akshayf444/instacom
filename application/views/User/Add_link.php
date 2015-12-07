<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header">Add Link</h3>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <label><?php
            if (isset($error)) {
                echo $error;
            }
            ?></label>
    </div>
</div>
<div class="row">
    <div class="col-lg-1"></div>
    <div class="col-lg-6 panel panel-default">
        <div class="panel panel-body">
            <?php
            $attributes = array('id' => 'activate');
            echo form_open('Link/Add_link', $attributes)
            ?>

            <div class="form-group">
                <label class="control-label">Add Url</label>
                <input type="text" name="link" class="form-control" id="link" placeholder="Enter Website Url"/>
            </div>
            <div class="form-group">
                <input type="submit"  class="btn btn-success" value="Add Url"/>
            </div>
            </form>
        </div>
    </div>
</div>
<script>
    $('document').ready(function () {

        $('#activate').formValidation({
            message: 'This value is not valid',
            icon: {
            },
            fields: {
                link: {
                    validators: {
                        notEmpty: {
                            message: 'Url Required'
                        },
                        uri: {
                            message: 'The website address is not valid'
                        },
                    }
                },                
            }
        });
    });
</script>
<script src="<?php echo asset_url() ?>js/formValidation.min.js" type="text/javascript"></script>
<script src="<?php echo asset_url() ?>js/bootstrap.min.js" type="text/javascript"></script>