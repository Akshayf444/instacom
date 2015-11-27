<?php echo form_open('Users/activate'); ?>
<div class="col-lg-4 col-lg-offset-2">
    <div class="login-logo">
        Basic Info
    </div><!-- /.login-logo -->
    <div class="login-box-body">
        <div class="form-group has-feedback">
            <label>Your Name</label>
            <input type="text" class="form-control" name="user_name"/>

        </div>
        <div class="form-group has-feedback">
            <label>Company Name</label>
            <input type="text" class="form-control" name="company_name"/>
        </div>
        <div class="form-group has-feedback">
            <label>Industry/Sector</label>
            <select class="form-control" name="industry">
                <?php echo $industry;?>
            </select>

        </div>
        <div class="form-group has-feedback">
            <label>Password</label>
            <input type="password" class="form-control" name="password" />

        </div>
        <div class="form-group has-feedback">
            <label>Repeat Password</label>
            <input type="password" class="form-control" name="rpassword"/>

        </div>

    </div>
</div>
<div class="col-lg-4 ">
    <div class="login-logo">
        Contact Info
    </div><!-- /.login-logo -->
    <div class="login-box-body">

        <div class="form-group has-feedback">
            <label>Address</label>
            <input type="text" class="form-control" name="address1" />

        </div>
        <div class="form-group has-feedback">
            <label>Address1</label>
            <input type="text" class="form-control" name="address2" />

        </div>

        <div class="form-group has-feedback">
            <label>Town/City</label>
            <input type="text" class="form-control" name="city"/>

        </div>
        <div class="form-group has-feedback">
            <label>State</label>
            <input type="password" class="form-control" name="state"/>

        </div>
        <div class="form-group has-feedback">
            <label>Pincode</label>
            <input type="password" class="form-control" name="pincode"/>

        </div>
        <div class="row">
            <div class="col-xs-8">    

            </div><!-- /.col -->
            <div class="col-xs-4">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Activate</button>
            </div><!-- /.col -->
        </div>
    </div><!-- /.login-box-body -->
</div><!-- /.login-box -->
</form>