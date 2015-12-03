<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header">Edit Contact</h3>
    </div>
</div>
<div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 panel panel-default">
                    <?php
                    $attributes = array('id' => 'activate');
                    echo form_open('Contact/Update_Contact',$attributes) ?>
                    <?php echo validation_errors(); ?>
                    <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label">First Name</label>
                            <input type="text" class="form-control"  name="first_name" value="<?php echo $show['fname'];?>" placeholder="Enter First Name"/>
                        </div>
                        <div class="form-group">
                            <input type="hidden" class="form-control"  name="contact_id" value="<?php echo $show['contact_id'];?>" placeholder="Enter First Name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Last Name</label>
                            <input type="text" class="form-control"  name="last_name" value="<?php echo $show['lname'];?>" placeholder="Enter Last Name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Mobile</label>
                            <input type="text" class="form-control"  name="mobile" value="<?php echo $show['mobile'];?>" placeholder="Enter Mobile Number"/>
                        </div>
                        
                        <div class="form-group">
                            <input type="submit" class="btn btn-success pull-right" value="Update Contact" />
                        </div>
                    </div>
                    </form>
                </div>
            </div>