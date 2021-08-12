#from sqlalchemy.ext.associationproxy import association_proxy

from sqlalchemy.orm import with_expression

from . import db


class Sessions(db.Model):
    __tablename__ = 'Sessions'

    ROWID = db.Column(db.Integer, primary_key=True)
    DateTimeUTC = db.Column(db.DateTime)
    Operator = db.Column(db.Text)
    Project = db.Column(db.Text)
    WorkFlowMode = db.Column(db.Integer)

    def __init__(self, session_id, date_time_utc, operator, work_flow_mode, project='null'):
        self.ROWID = session_id
        self.DateTimeUTC = date_time_utc
        self.Operator = operator
        self.Project = project
        self.WorkFlowMode = work_flow_mode


class SampleDetails(db.Model):
    __tablename__ = 'SampleDetails'

    SessionId = db.Column(db.Integer, db.ForeignKey('Sessions.ROWID'), primary_key=True)
    Name = db.Column(db.Text)
    ProteinClass = db.Column(db.Text)
    MolecularWeight = db.Column(db.Integer)
    Concentration = db.Column(db.Float)
    BufferDescription = db.Column(db.Text)
    BufferConcentration = db.Column(db.Integer)
    BufferUnit = db.Column(db.Integer)
    PH = db.Column(db.Float)
    DetergentType = db.Column(db.Text)
    DetergentConcentration = db.Column(db.Float)
    DetergentUnit = db.Column(db.Integer)
    SaltType = db.Column(db.Text)
    SaltConcentration = db.Column(db.Float)
    SaltUnit = db.Column(db.Integer)
    OtherType = db.Column(db.Integer)
    GlycerolConcentration = db.Column(db.Integer)
    GlycerolUnit = db.Column(db.Integer)
    AspirateVolume = db.Column(db.Float)
    SampleBlockTemperature = db.Column(db.Float)
    Notes = db.Column(db.Text)

    def __init__(self, session_id, name, protein_class, molecular_weight, concentration, buffer_desc, buffer_conc, buffer_unit, ph, detergent_type, detergent_conc, detergent_unit, salt_type, salt_conc, salt_unit, other_type, glycerol_conc, glycerol_unit, aspirate_vol, sample_block_temp, notes):
        self.SessionId = session_id
        self.Name = name
        self.ProteinClass = protein_class
        self.MolecularWeight = molecular_weight
        self.Concentration = concentration
        self.BufferDescription = buffer_desc
        self.BufferConcentration = buffer_conc
        self.BufferUnit = buffer_unit
        self.PH = ph
        self.DetergentType = detergent_type
        self.DetergentConcentration = detergent_conc
        self.DetergentUnit = detergent_unit
        self.SaltType = salt_type
        self.SaltConcentration = salt_conc
        self.SaltUnit = salt_unit
        self.OtherType = other_type
        self.GlycerolConcentration = glycerol_conc
        self.GlycerolUnit = glycerol_unit
        self.AspirateVolume = aspirate_vol
        self.SampleBlockTemperature = sample_block_temp
        self.Notes = notes


class Operations(db.Model):
    __tablename__ = 'Operations'

    ROWID = db.Column(db.Integer, primary_key=True)
    DateTimeUTC = db.Column(db.DateTime)
    GridId = db.Column(db.Integer, primary_key=True)
    SampleDetailsId = db.Column(db.Integer, db.ForeignKey('SampleDetails.SessionId'))
    AcceptedId = db.Column(db.Integer, primary_key=True)
    RejectedId = db.Column(db.Integer, primary_key=True)

    def __init__(self, operation_id, operation_time, grid_id, sample_details_id, accepted_id, rejected_id):
        self.ROWID = operation_id
        self.DateTimeUTC = operation_time
        self.GridId = grid_id
        self.SampleDetailsId = sample_details_id
        self.AcceptedId = accepted_id
        self.RejectedId = rejected_id        


class Plunges(db.Model):
    __tablename__ = 'Plunges'

    OperationId = db.Column(db.Integer, db.ForeignKey('Operations.ROWID'), primary_key=True)
    EthaneTemp = db.Column(db.Float)
    LN2Level = db.Column(db.Integer)
    WickingTimeUsed = db.Column(db.Time)
    Mode = db.Column(db.Integer)
    WickingTimeSuggested = db.Column(db.Text)

    def __init__(self, operation_id, ethane_temp, ln2_level, wicking_time_used, plunge_mode, wicking_time_suggested):
        self.OperationId = operation_id
        self.EthaneTemp = ethane_temp
        self.LN2Level = ln2_level
        self.WickingTimeUsed = wicking_time_used
        self.Mode = plunge_mode
        self.WickingTimeSuggested = wicking_time_suggested


class Treatments(db.Model):
    __tablename__ = 'Treatments'

    GridId = db.Column(db.Integer, db.ForeignKey('Operations.GridId'), primary_key=True)
    GlowDischargeId = db.Column(db.Integer)

    def __init__(self, grid_id, glow_discharge_id):
        self.GridId = grid_id
        self.GlowDischargeId = glow_discharge_id


class Dispenses(db.Model):
    __tablename__ = 'Dispenses'

    OperationId = db.Column(db.Integer, db.ForeignKey('Operations.ROWID'), primary_key=True)
    AmbientRH = db.Column(db.Float)
    AmbientTemp = db.Column(db.Float)
    ShroudRH = db.Column(db.Float)
    ShroudTemp = db.Column(db.Float)
    RemainingVolume = db.Column(db.Float)
    DispenserAmplitude = db.Column(db.Integer)
    SampleTimer = db.Column(db.Time)

    def __init__(self, operation_id, ambient_rh, ambient_temp, shroud_rh, shroud_temp, remaining_vol, dispenser_amp, sample_timer):
        self.OperationId = operation_id
        self.AmbientRH = ambient_rh
        self.AmbientTemp = ambient_temp
        self.ShroudRH = shroud_rh
        self.ShroudTemp = shroud_temp
        self.RemainingVolume = remaining_vol
        self.DispenserAmplitude = dispenser_amp
        self.SampleTimer = sample_timer


class Grids(db.Model):
    __tablename__ = 'Grids'

    ROWID = db.Column(db.Integer, db.ForeignKey('Operations.GridId'), primary_key=True)
    Box = db.Column(db.Text)
    Slot = db.Column(db.Integer)
    Type = db.Column(db.Text)
    SerialNumber = db.Column(db.Text)
    BatchNumber = db.Column(db.Text)
    Notes = db.Column(db.Text)

    def __init__(self, grid_id, box, slot, type, serial_number, batch_number, notes):
        self.ROWID = grid_id
        self.Box = box
        self.Slot = slot
        self.Type = type
        self.SerialNumber = serial_number
        self.BatchNumber = batch_number
        self.Notes = notes


class AcceptedGrids(db.Model):
    __tablename__ = 'AcceptedGrids'

    ROWID = db.Column(db.Integer, db.ForeignKey('Operations.AcceptedId'), primary_key=True)
    Evaluation = db.Column(db.Integer)
    WithGradient = db.Column(db.Integer)
    Comments = db.Column(db.Text)

    def __init__(self, accepted_id, evaluation, with_gradient, comments):
        self.ROWID = accepted_id
        self.Evaluation = evaluation
        self.WithGradient = with_gradient
        self.Comments = comments


class GlowDischarges(db.Model):
    __tablename__ = 'GlowDischarges'

    ROWID = db.Column(db.Integer, db.ForeignKey('Treatments.GlowDischargeId'), primary_key=True)
    Instrument = db.Column(db.Text)
    Duration = db.Column(db.Time)

    def __init__(self, glow_discharge_id, instrument, duration):
        self.ROWID = glow_discharge_id
        self.Instrument = instrument
        self.Duration = duration

class RejectedGrids(db.Model):
    __tablename__ = 'RejectedGrids'

    ROWID = db.Column(db.Integer, db.ForeignKey('Operations.RejectedId'), primary_key=True)
    Evaluation = db.Column(db.Integer)
    Comments = db.Column(db.Text)

    def __init__(self, rejected_id, evaluation, with_gradient, comments):
        self.ROWID = rejected_id
        self.Evaluation = evaluation
        self.Comments = comments
