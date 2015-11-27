<div class="login-box">
    <div class="login-logo">
        <a href="../../index2.html"><b>Instacom</b>Messanger</a>
    </div><!-- /.login-logo -->
    <div class="login-box-body">
        <p class="login-box-msg">Sign in to start your session</p>
        <?php echo form_open('Users/login'); ?>
        <div class="form-group has-feedback">
            <input type="text" class="form-control" name="username" placeholder="Mobile"/>
        </div>
        <div class="form-group has-feedback">
            <input type="password" class="form-control" name="password" placeholder="Password"/>

        </div>
        <div class="row">
            <div class="col-xs-8">    

            </div><!-- /.col -->
            <div class="col-xs-4">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
            </div><!-- /.col -->
        </div>
        </form>
        <a href="#">I forgot my password</a><br>
        <a href="<?php echo site_url('Users/register'); ?>" class="text-center">Register a new membership</a>

    </div><!-- /.login-box-body -->
</div><!-- /.login-box -->