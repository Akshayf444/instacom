<div class="col-lg-12">
    <?php
    if (isset($success) && $success == true) {
        echo '<div class = "row"><div class = "col-lg-12 col-md-12"><div class="alert alert-success"> '
        . '<a href="#" class="close" data-dismiss="alert">&times;</a>'
        . '<strong>Success!! </strong>Doctor Added Successfully.</div></div></div>';
    }
    ?>
</div>
<div class="col-lg-12">
    <h3>Doctor <?php if (isset($doctorCount)) echo $doctorCount ?></h3>
</div>
<div class="col-lg-12 col-sm-12 ">
    <?php
    $attributes = array('id' => 'form1');
    if (isset($is_edit) && $is_edit == 'TRUE') {
        echo form_open('Doctors/edit/' . $doctorDetail->docid, $attributes);
    } else {
        if ($doctorCount < 51) {
            echo form_open('Doctors/add', $attributes);
        } else {
            echo '<div class = "row"><div class = "col-lg-12 col-md-12"><div class="alert alert-danger"> '
            . '<a href="#" class="close" data-dismiss="alert">&times;</a>'
            . '<strong>Error!! </strong>You Can Add Only 50 Doctors.</div></div></div>';
        }
    }
    ?>

    <dl class="col-lg-4"><label>First Name</label> <dd class="form-group"><input type="text" name="fname" class="form-control" value="<?php
            if (isset($doctorDetail->fname)) {
                echo $doctorDetail->fname;
            }
            ?>" placeholder="Enter Name"/></dd></dl>
    <dl class="col-lg-4"><label>Last Name</label> <dd class="form-group"><input type="text" name="lname" class="form-control" value="<?php
            if (isset($doctorDetail->lname)) {
                echo $doctorDetail->lname;
            }
            ?>" placeholder="Enter Name"/></dd></dl>
    <dl class="col-lg-4"><label>Speciality</label> <dd class="form-group">
            <?php $speciality = array('General Physician', 'Consulting Physician', 'General Surgeon', 'ENT'); ?>
            <select class="form-control" name="speciality">
                <option value="">Select Speciality</option>
                <?php foreach ($speciality as $item) { ?>
                    <option <?php if (isset($doctorDetail->speciality) && $doctorDetail->speciality == $item) echo 'selected'; ?> value="<?php echo $item ?>"><?php echo $item ?></option>
                <?php } ?>

            </select>
        </dd>
    </dl>
    <?php
    if (isset($is_edit) && $is_edit == 'TRUE') {
        echo '<input type="hidden" value="' . $doctorDetail->docid . '" name="docid" >';
    }
    ?>
    <dl class="col-lg-4"><label>Class</label> <dd class="form-group">
            <?php $class = array('Core', 'Non Core'); ?>
            <select class="form-control" name="class">
                <option value="">Select Class</option>
                <?php foreach ($class as $item) { ?>
                    <option <?php if (isset($doctorDetail->class) && $doctorDetail->class == $item) echo 'selected'; ?> value="<?php echo $item ?>"><?php echo $item ?></option>
                <?php } ?>

            </select>
        </dd>
    </dl>
    <dl class="col-lg-4"><label>Mobile No</label> <dd class="form-group"><input type="text" name="mobile" class="form-control" value="<?php
            if (isset($doctorDetail->mobile)) {
                echo $doctorDetail->mobile;
            }
            ?>" placeholder="Enter Mobile No"/></dd></dl>
    <dl class="col-lg-4"><label>Place</label> <dd><input type="text"  name="place" value="<?php
            if (isset($doctorDetail->place)) {
                echo $doctorDetail->place;
            }
            ?>" class="form-control" placeholder="Enter Place"/></dd></dl>
    <dl class="col-lg-12"><label class="row col-lg-12">Dr. Registration No.(As per Unnati)</label><dd class="row col-lg-4 form-group" > <input type="text"  name="unnati_id" value="<?php
            if (isset($doctorDetail->unnati_id)) {
                echo $doctorDetail->unnati_id;
            }
            ?>" class="form-control " placeholder="Enter Unnati ID"/></dd></dl>

    <dl class="col-lg-4"><dd><input type="submit" class="btn btn-success" value="Save"></dd></dl>
            <?php echo form_close(); ?>
</div>
<script>
    $('document').ready(function () {
        $('#form1').formValidation({
            message: 'This value is not valid',
            icon: {
            },
            fields: {
                fname: {
                    validators: {
                        notEmpty: {
                            message: 'First Name is Required'
                        },
                    }
                },
                lname: {
                    validators: {
                        notEmpty: {
                            message: 'Last Name is Required'
                        },
                    }
                },
                speciality: {
                    validators: {
                        notEmpty: {
                            message: 'Please Select Speciality'
                        },
                    }
                },
                class: {
                    validators: {
                        notEmpty: {
                            message: 'Please Select Class For Doctor'
                        },
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {
                            message: 'Please Enter Mobile No'
                        },
                        digits: {
                            message: 'Mobile No Has to be in digits'
                        },
                        stringLength: {
                            max: 10,
                            message: 'Mobile No Must Be 10 Digits'
                        }
                    }
                },
                unnati_id: {
                    validators: {
                        notEmpty: {
                            message: 'Please Enter Unnati Id'
                        },
                    }
                },
            }
        });
    });

</script>