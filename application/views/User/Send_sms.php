<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header"> Send SMS</h3>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <h3 class=""> 
            <?php
            if (isset($success)) {
                echo $success;
            }
            ?></h3>
    </div>
</div>
<div class="tabs">
    <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#tab1">Send SMS</a></li>
        <li><a data-toggle="tab" href="#tab2">Group SMS</a></li>
    </ul>

    <div class="tab-content">
        <div id="tab1"  class="tab-pane fade in active">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 panel panel-default">
                    <?php
                    $attributes = array('id' => 'activate');
                    echo form_open('Contact/Send_sms', $attributes)
                    ?>
                    <?php echo validation_errors(); ?>
                    <div class="panel-body">

                        <div class="form-group">
                            <label class="control-label">Mobile</label>
                            <input type="text" class="form-control"  name="mobile" placeholder="Enter Mobile Number"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Message</label>
                            <textarea class="form-control" style="height: 155px;" name="message"></textarea>
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btn btn-success pull-right" value="Send SMS" />
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="tab2" class="tab-pane fade">
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-6 panel panel-default">
                    <?php echo form_open('Contact/Send_sms_group') ?>
                    <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label">Select Group</label>
                            <select class="form-control" name="group">
                                <option value="">-Select-</option>
                                <?php foreach ($list as $li): ?>
                                    <option value="<?php echo $li->id ?>"><?php echo $li->group_name ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <a class="btn btn-primary" id="first" name="first">First Name</a>
                            <a class="btn btn-primary" id="last" name="last">Last Name</a>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Message</label>
                            <textarea class="form-control" style="height: 155px;" id="message" name="message"></textarea>
                        </div>
                        <div class="form-group">
                            <input type="submit" value="Send SMS" class="btn btn-success pull-right"/>
                        </div>
                    </div>
                    </form>
                </div>
                <div class="col-lg-3 panel panel-default">
                    <div class="panel panel-body">
                        <div class="form-group">
                            <label class="control-label">Select Template</label>
                            <select class="form-control" name="template" id="my-select">
                                <option value="">-Select-</option>
                                <?php foreach ($show as $li): ?>
                                    <option  value="<?php echo $li->message ?>"><?php echo $li->title ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="panel panel-body">
                        <div class="form-group">
                            <label class="control-label">Select Url</label>
                            <select class="form-control" name="Link" id="Link">
                                <option value="">-Select-</option>
                                <?php foreach ($show2 as $S): ?>
                                    <option  value="<?php echo 'http://ic8.in/' . $S->link . '/#tracking#' ?>"><?php echo $S->Actual ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                </div>
            </div>   
        </div>
    </div>
</div>
<script>
    $(document).ready(function () {
        $('#first').click(function () {
            $('#message').append('#FirstName#');
        })
        $('#last').click(function () {
            $('#message').append('#LastName#');
        })
        $('#my-select').change(function () {
            // alert($('#message2').val());
            $('#message').append($(this).val());
        })
        $('#Link').change(function () {
            // alert($('#message2').val());
            $('#message').append($(this).val());
        })
    })
</script>