<div class="tabs">
    <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#tab1">Add Contact</a></li>
        <li><a data-toggle="tab" href="#tab2">Add Multiple</a></li>
        <!--        <li><a data-toggle="tab" href="#tab3">Csv Upload</a></li>-->
    </ul>

    <div class="tab-content">
        <div id="tab1"  class="tab-pane fade in active">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 panel panel-default">
                    <?php
                    $attributes = array('id' => 'activate');
                    echo form_open('Contact/Add_contact', $attributes)
                    ?>
                    <?php echo validation_errors(); ?>
                    <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label">First Name</label>
                            <input type="text" class="form-control"  name="first_name" placeholder="Enter First Name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Last Name</label>
                            <input type="text" class="form-control"  name="last_name" placeholder="Enter Last Name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Mobile</label>
                            <input type="text" class="form-control"  name="mobile" placeholder="Enter Mobile Number"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Select Group</label>
                            <select class="form-control" name="group_id">
                                <option value="">-Select Group-</option>
                                <?php foreach ($list as $sh): ?>
                                    <option value="<?php echo $sh->id ?>"><?php echo $sh->group_name ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btn btn-success pull-right" value="Add Contact" />
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="tab2" class="tab-pane fade">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 panel panel-default">
                    <div class="panel panel-body">
                        <?php echo form_open('Contact/bulk_contact') ?>
                        <div class="form-group">
                            <label class="control-label">Enter Multiple Number(Notice :Please Press Enter After Every Number)</label>
                            <textarea class="form-control" style="height: 155px;" name="text"></textarea>
                        </div>
                        <div class="form-group">
                            <input type="submit" value="Add Contact" class="btn btn-success"/>
                        </div>
                        </form>
                    </div>
                </div>
            </div>   
        </div>
        <div id="tab3" class="tab-pane fade">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6">
                    <?php echo form_open_multipart('Contact/Csv_upload') ?>
                    <div class="form-group">
                        <input type="file" name="resume"/>
                    </div>
                    <div class="form-group">
                        <input type="submit" value="Add Contact" class="btn btn-success"/>
                    </div>
                    </form>
                </div>
            </div>
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
                first_name: {
                    validators: {
                        notEmpty: {
                            message: 'Your Name is Required'
                        },
                    }
                },
                last_name: {
                    validators: {
                        notEmpty: {
                            message: 'Last Name is required'
                        },
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {
                            message: 'Mobile Number is required'
                        },
                    }
                },
            }
        });
    });
</script>