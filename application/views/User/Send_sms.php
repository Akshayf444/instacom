<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header"> Send SMS</h3>
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
                    echo form_open('Contact/', $attributes)
                    ?>
                    <?php echo validation_errors(); ?>
                    <div class="panel-body">

                        <div class="form-group">
                            <label class="control-label">Mobile</label>
                            <input type="text" class="form-control"  name="mobile" placeholder="Enter Mobile Number"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Message</label>
                            <textarea class="form-control" name="message"></textarea>
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
                <div class="col-lg-3"></div>
                <div class="col-lg-6 panel panel-default">
                    <?php echo form_open('Contact/') ?>
                    <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label">Select Group</label>
                            <select class="form-control">
                                <option value="">-Select-</option>
                                <?php foreach ($list as $li): ?>
                                    <option value="<?php echo $li->id ?>"><?php echo $li->group_name ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Message</label>
                            <textarea class="form-control" name="message"></textarea>
                        </div>
                        <div class="form-group">
                            <input type="submit" value="Send SMS" class="btn btn-success pull-right"/>
                        </div>
                    </div>
                    </form>
                </div>
            </div>   
        </div>
    </div>
</div>