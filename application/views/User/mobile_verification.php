<div class="login-box">
    <div class="login-logo">
        <a href="../../index2.html"><b>Instacom</b>Messanger</a>
    </div><!-- /.login-logo -->
    <div class="login-box-body">
        <?php
        if (isset($error)) {
            echo "<h4>" . $error . "</h4>";
        }
        ?>
        <p class="login-box-msg">Enter Your Verification Code</p>
        <?php echo form_open('Users/mobile_verification'); ?>
        <div class="form-group has-feedback">
            <input type="text" class="form-control" name="code" placeholder="Enter Your Verification Code" maxlength="4" minlength="4"/>
            <input type="hidden" class="form-control" name="mob" value="<?php if(isset($mob)){echo $mob;}?>"/>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="row">
            <div class="col-xs-8">    

            </div><!-- /.col -->
            <div class="col-xs-4">
                <input type="submit" class="btn btn-primary btn-block btn-flat" value="Verify"/>
            </div><!-- /.col -->
        </div>
        </form>
<!--
        <a href="<?php echo site_url('Users/login'); ?>" class="text-center">Sign In</a>-->

    </div><!-- /.login-box-body -->
</div><!-- /.login-box -->